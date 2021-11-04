const firebase = require("./config");
module.exports = {
	setNewBid: function (req, res) {
		const dbRef = firebase.database().ref();
		let highestBid = 0;
		dbRef
			.child("rooms")
			.child(req.roomname)
			.get()
			.then((snapshot) => {
				if (snapshot.exists()) {
					dbRef
						.child("rooms")
						.child(req.roomname)
						.child("highest")
						.get()
						.then(async (snapshot) => {
							if (snapshot.exists()) {
								highestBid = snapshot.val();
								if (highestBid.bid >= req.bid) {
									res.status(400).json({
										err: "Bid has to be higher than current highest bid",
									});
								} else {
									await firebase
										.database()
										.ref("rooms/" + req.roomname + "/bids/" + req.username)
										.set({
											username: req.username,
											bid: req.bid,
										});
									await firebase
										.database()
										.ref("rooms/" + req.roomname + "/highest/")
										.set({
											username: req.username,
											bid: req.bid,
										});
									res.send(
										"Inserted user " + req.username + " with bid " + req.bid
									);
								}
							}
						})
						.catch((err) => {
							console.error(err);
						});
				} else {
					res.status(400).json({
						err: "No such room",
					});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	},
	createNewRoom: function (req, res) {
		const dbRef = firebase.database().ref();
		dbRef
			.child("rooms")
			.child(req.roomname)
			.get()
			.then((snapshot) => {
				if (snapshot.exists()) {
					res.status(400).json({
						err: "Room already exists",
					});
				} else {
					firebase
						.database()
						.ref("rooms/" + req.roomname + "/highest/")
						.set({
							username: "dummy",
							bid: 0,
						})
						.then(() => {
							firebase
								.database()
								.ref("rooms/" + req.roomname + "/owner/")
								.set({
									username: req.owner,
								})
								.then(() => {
									res.status(200).send("Room created");
								})
								.catch(() => {
									res.status(500).send("Error: " + err);
								});
						})
						.catch((err) => {
							res.status(500).send("Error: " + err);
						});
				}
			})
			.catch((err) => {
				res.status(500).send("Error: " + err);
			});
	},
};
