// const path = require('path');
// const http = require('http');
// const express = require('express');
// const socketio = require('socket.io');
// const cors = require('cors');
// const formatMessage = require('./utils/messages');
// const app = express();
// app.use(express());
// const {
// 	userJoin,
// 	getCurrentUser,
// 	userLeave,
// 	getRoomUsers
// } = require('./utils/users');

// const server = http.createServer(app);
// const io = socketio(server);


// app.use(cors())
// // Set static folder
// app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// const botName = 'ChatCord Bot';


// Run when client connects
// add crud for rooms
// io.on('connection', socket => {
// 	socket.on('joinRoom', ({ username, room }) => {
// 		const user = userJoin(socket.id, username, room);

// 		socket.join(user.room);

// 		// Welcome new buyer
// 		socket.emit('message', formatMessage(botName, 'Welcome to roomOwner\'s auction!'));

// 		// Broadcast when a buyer connects
// 		socket.broadcast
// 			.to(user.room)
// 			.emit(
// 				'message',
// 				formatMessage(botName, `${user.username} has joined the chat`)
// 			);

// 		// Send users and room info
// 		io.to(user.room).emit('roomUsers', {
// 			room: user.room,
// 			users: getRoomUsers(user.room)
// 		});
// 	});

// 	// Listen for new bid
// 	socket.on('newBid', ({ bidAmount }) => {
// 		const user = getCurrentUser(socket.id);
// 		//push to firebase db, then broadcast(use broadcast.emit)
// 		axios.post('http://localhost:3000/api/room/newbid', {
// 			username: user.username,
// 			bid: bidAmount,
// 			roomname: user.room
// 		})
// 			.then(function (response) {
// 				io.to(user.room).emit('message', formatBidMessage(user.username, bidAmount));
// 				console.log(response);
// 			})
// 			.catch(function (error) {
// 				console.log(error);
// 			});
// 	});


// 	// socket.on("chat", (text) => {
// 	// 	//gets the room user and the message sent
// 	// 	const p_user = getCurrentUser(socket.id);

// 	// 	io.to(p_user.room).emit("message", {
// 	// 	  userId: p_user.socket_id,
// 	// 	  username: p_user.username,
// 	// 	  text: text,
// 	// 	});
// 	//   });

// 	// Listen for new messages
// 	socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
// 		io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
// 	});

// 	// Runs when client disconnects, bid still stands
// 	socket.on('disconnect', () => {
// 		const user = userLeave(socket.id);

// 		if (user) {
// 			io.to(user.room).emit(
// 				'message',
// 				formatMessage(botName, `${user.username} has left the chat`)
// 			);

// 			// Send users and room info
// 			io.to(user.room).emit('roomUsers', {
// 				room: user.room,
// 				users: getRoomUsers(user.room)
// 			});
// 		}
// 	});
// });


const server = require("http").createServer();
const { createAdapter } = require("@socket.io/redis-adapter");
//const { createClient } = require("redis");
const Redis = require("ioredis");
const { RateLimiterRedis } = require('rate-limiter-flexible');

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});

// socket io redis adapter
// const pubClient = createClient({ host: "localhost", port: 6379});

// redis.connect(function () {
// 	/* then run all your code, get rid of setTimeout() */

// })

const pubClient = new Redis(
	{
		host: "localhost",
		port: 6379,
		enableOfflineQueue: false,
		lazyConnect: true
	});
const subClient = pubClient.duplicate();
// const subClient = createClient();
// subClient.then(() => {

// }).catch();
subClient.on('connect', function () { io.adapter(createAdapter(pubClient, subClient)); });


//rate limiter
// It is recommended to process Redis errors and setup some reconnection strategy
subClient.on('error', (err) => {

});


const opts = {
	// Basic options
	storeClient: subClient,
	points: 5, // Number of points
	duration: 5, // Per second(s)

	// Custom
	execEvenly: false, // Do not delay actions evenly
	blockDuration: 0, // Do not block if consumed more than points
	keyPrefix: 'rlflx', // must be unique for limiters with different purpose
};

const rateLimiterRedis = new RateLimiterRedis(opts);





const PORT = 9000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const NEW_BID_EVENT = "newBid";
const END_AUCTION_EVENT = "endAuction";

io.on("connection", (socket) => {

	// Join a conversation
	const { roomId } = socket.handshake.query;
	socket.join(roomId);

	// Listen for new messages
	socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {

		rateLimiterRedis.consume(socket.handshake.address)
			.then((rateLimiterRes) => {
				// ... Some app logic here ...
				console.log(data);
				io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
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
					res.set('Retry-After', String(secs));
					res.status(429).send('Too Many Requests');
				}
			});
	});

	// Listen for new bids
	socket.on(NEW_BID_EVENT, (data) => {
		console.log(data);
		io.in(roomId).emit(NEW_BID_EVENT, data);
	});

	// Listen for auction end
	socket.on(END_AUCTION_EVENT, (data) => {
		console.log(data);
		io.in(roomId).emit(END_AUCTION_EVENT, data);
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


