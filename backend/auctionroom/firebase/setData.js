const firebase = require("./config");
module.exports = {
	setNewBid: function (req, res) {
		const dbRef = firebase.database().ref();
		let highestBid = 0;
		dbRef
			.child(req.roomname)
			.child("highest")
			.get()
			.then((snapshot) => {
				if (snapshot.exists()) {
					highestBid = snapshot.val();
					if (highestBid.bid >= req.bid) {
						res.status(400).json({
							err: "Bid has to be higher than current highest bid",
						});
					} else {
						firebase
							.database()
							.ref(req.roomname + "/bids/" + req.username)
							.set({
								username: req.username,
								bid: req.bid,
							});
						firebase
							.database()
							.ref(req.roomname + "/highest/")
							.set({
								username: req.username,
								bid: req.bid,
							});
						res.send(
							"Inserted user " +
								req.username +
								" with bid " +
								req.bid
						);
					}
				} else {
					firebase
						.database()
						.ref(req.roomname + "/highest/")
						.set({
							username: req.username,
							bid: req.bid,
						});
					firebase
						.database()
						.ref(req.roomname + "/bids/" + req.username)
						.set({
							username: req.username,
							bid: req.bid,
						});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	},
};
