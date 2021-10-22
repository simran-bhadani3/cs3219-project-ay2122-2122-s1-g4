const firebase = require("./config");
module.exports = {
	deleteRoom: function (req, res) {
		const dbRef = firebase.database().ref();
		dbRef
			.child("rooms")
			.child(req.params.roomname)
			.get()
			.then((snapshot) => {
				if (snapshot.exists()) {
					firebase
						.database()
						.ref("rooms/" + req.params.roomname)
						.remove()
						.then(() => {
							res.status(200).send("Room deleted");
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
