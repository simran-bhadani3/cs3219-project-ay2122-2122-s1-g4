const firebase = require("./config");
module.exports = {
	getBid: function (req, res) {
		const bidRef = firebase.database().ref();
		bidRef
			.child("rooms")
			.child(req.params.roomname)
			.child("bids")
			.child(req.params.username)
			.child("bid")
			.get()
			.then((snapshot) => {
				if (snapshot.exists()) {
					res.json({ bid: snapshot.val() });
				} else {
					res.json({ bid: "Bid does not exist"});
				}
			})
			.catch((error) => {
				res.status(500).json({
					err: error,
				});
			});
	},
};
