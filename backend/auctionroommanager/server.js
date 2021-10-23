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
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});

const PORT = 9000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const NEW_BID_EVENT = "newBid";

io.on("connection", (socket) => {

	// Join a conversation
	const { roomId } = socket.handshake.query;
	socket.join(roomId);

	// Listen for new messages
	socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
		console.log(data);
		io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
	});

	// Listen for new bids
	socket.on(NEW_BID_EVENT, (data) => {
		console.log(data);
		io.in(roomId).emit(NEW_BID_EVENT, data);
	});

	// Leave the room if the user closes the socket
	socket.on("disconnect", () => {
		socket.leave(roomId);
	});
});

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
