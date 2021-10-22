const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// use cors
var cors = require('cors')
app.use(cors())
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const botName = 'ChatCord Bot';

// Run when client connects
// add crud for rooms
io.on('connection', socket => {
	socket.on('joinRoom', ({ username, room }) => {
		const user = userJoin(socket.id, username, room);

		socket.join(user.room);

		// Welcome new buyer
		socket.emit('message', formatMessage(botName, 'Welcome to roomOwner\'s auction!'));

		// Broadcast when a buyer connects
		//   socket.broadcast
		// 	.to(user.room)
		// 	.emit(
		// 	  'message',
		// 	  formatMessage(botName, `${user.username} has joined the chat`)
		// 	);

		// Send users and room info
		// io.to(user.room).emit('roomUsers', {
		// 	room: user.room,
		// 	users: getRoomUsers(user.room)
		// });
	});

	// Listen for new bid
	socket.on('newBid', ({ bidAmount }) => {
		const user = getCurrentUser(socket.id);
		//push to firebase db, then broadcast(use broadcast.emit)
		axios.post('http://localhost:3000/api/room/newbid', {
			username: user.username,
			bid: bidAmount,
			roomname: user.room
		})
			.then(function (response) {
				io.to(user.room).emit('message', formatBidMessage(user.username, bidAmount));
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});
	});

	// Runs when client disconnects, bid still stands
	socket.on('disconnect', () => {
		const user = userLeave(socket.id);

		if (user) {
			io.to(user.room).emit(
				'message',
				formatMessage(botName, `${user.username} has left the chat`)
			);

			// Send users and room info
			io.to(user.room).emit('roomUsers', {
				room: user.room,
				users: getRoomUsers(user.room)
			});
		}
	});
});

const PORT = process.env.PORT || 9000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
