const { createAdapter } = require("@socket.io/redis-adapter");
//const { createClient } = require("redis");
const Redis = require("ioredis");
const { RateLimiterRedis } = require('rate-limiter-flexible');

const server = require("http").createServer();

//rate limit client
// const redisClient = new Redis({ enableOfflineQueue: false });

// docker redis

// const redisClient = new Redis(
// 	{
// 		host: "localhost",
// 		port: 30379,
// 		enableOfflineQueue: false,
// 	});

//kubernetes cluster
const redisClient = new Redis(
	{
		host: "redis-leader.default.svc.cluster.local",
		port: 6379,
		enableOfflineQueue: false,
	});

// options = {
// 	cors: true,
// 	origins: ["*"],
// 	methods: ["GET", "POST"],
//     credentials: true
// }

// const io = require("socket.io")(server);

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	},
});

// io.set("transports", ["websocket"]);

// socket io redis adapter
// const pubClient = createClient({ host: "localhost", port: 6379});

// redis.connect(function () {
// 	/* then run all your code, get rid of setTimeout() */

// })30379

// docker redis
// const pubClient = new Redis(
// 	{
// 		host: "localhost",
// 		port: 6379,
// 		enableOfflineQueue: false,
// 		lazyConnect: true
// 	});

// kubernetes nodeport
// const pubClient = new Redis(
// 	{
// 		host: "localhost",
// 		port: 30379,
// 		enableOfflineQueue: false,
// 		lazyConnect: true
// 	});

// kubernetes cluster
const pubClient = new Redis(
	{
		host: "redis-leader.default.svc.cluster.local",
		port: 6379,
		enableOfflineQueue: false,
		lazyConnect: true
	}
);

const subClient = pubClient.duplicate();

subClient.on('connect', function () {
	console.log('redis connected')
	io.adapter(createAdapter(pubClient, subClient));
});


//rate limiter
// It is recommended to process Redis errors and setup some reconnection strategy
subClient.on('error', (err) => {
	console.log('unable to connect redis')
});


const opts = {
	// Basic options
	storeClient: redisClient,
	points: 5, // Number of points
	duration: 10, // Per second(s)

	//Custom
	execEvenly: false, // Do not delay actions evenly
	blockDuration: 30, // Do not block if consumed more than points
	keyPrefix: 'rlflx', // must be unique for limiters with different purpose
};


const rateLimiterRedis = new RateLimiterRedis(opts);
const PORT = 9000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const NEW_BID_EVENT = "newBid";
const END_AUCTION_EVENT = "endAuction";

const nsp = io.of("/auctionroom");

nsp.on("connection", (socket) => {
	console.log('new connection!');
	// Join a conversation
	const { roomId } = socket.handshake.query;
	socket.join(roomId);

	// Listen for new messages
	socket.on(NEW_CHAT_MESSAGE_EVENT, async (data) => {
		console.log(data);
		rateLimiterRedis.consume(socket.handshake.address)
			.then((rateLimiterRes) => {
				// ... Some app logic here ...
				console.log(rateLimiterRes);
				console.log(data);
				nsp.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
			})
			.catch((rejRes) => {
				if (rejRes instanceof Error) {
					// Some Redis error
					// Never happen if `insuranceLimiter` set up
					// Decide what to do with it in other case
				} else {
					// Can't consume
					// If there is no error, rateLimiterRedis promise rejected with number of ms before next request allowed
					const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
					socket.emit(NEW_CHAT_MESSAGE_EVENT, { body: "Please do not spam the chat!" });
					// res.set('Retry-After', String(secs));
					// res.status(429).send('Too Many Requests');
				}
			});
	});

	// Listen for new bids
	socket.on(NEW_BID_EVENT, (data) => {
		console.log(data);
		nsp.in(roomId).emit(NEW_BID_EVENT, data);
	});

	// Listen for auction end
	socket.on(END_AUCTION_EVENT, (data) => {
		console.log(data);
		nsp.in(roomId).emit(END_AUCTION_EVENT, data);
	});

	//
	// Leave the room if the user closes the socket
	socket.on("disconnect", () => {
		socket.leave(roomId);
	});
});

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});



