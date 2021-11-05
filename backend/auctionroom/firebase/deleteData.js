const firebase = require("./config");
const axios = require("axios");
module.exports = {
	deleteRoom: function (req, res) {
		const dbRef = firebase.database().ref();
		dbRef
			.child("rooms")
			.child(req.params.roomname)
			.get()
			.then(async (snapshot) => {
				if (snapshot.exists()) {
					const bidRef = firebase.database().ref();
					const sender = await bidRef
						.child("rooms")
						.child(req.params.roomname)
						.child("highest")
						.child("username")
						.get()
						.then((snapshot) => snapshot.val());
					const receiver = await bidRef
						.child("rooms")
						.child(req.params.roomname)
						.child("owner")
						.child("username")
						.get()
						.then((snapshot) => snapshot.val());
					const currency = await bidRef
						.child("rooms")
						.child(req.params.roomname)
						.child("highest")
						.child("bid")
						.get();
					//local url: http://localhost:8082/api/currency/transaction
					const response = await axios.post("http://currencymanagement.default.svc.cluster.local:8082/api/currency/transaction", {
						sender: sender,
						receiver: receiver,
						currency: currency,
					});
					await firebase
						.database()
						.ref("rooms/" + req.params.roomname)
						.remove()
						.then(() => {
							res.status(200).json({ transaction: response.data.message, room: "Room deleted" });
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
					res.status(400).send({ err: "No such room exists" });
				}
			})
			.catch((err) => {
				console.log(err);
			});
	},
};
