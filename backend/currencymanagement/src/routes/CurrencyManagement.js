const express = require("express");

const router = express.Router();

const User = require("../models/User");

router.get("/:userid", (req, res) => {
	userid = req.params.userid;
	User.findOne({ _id: userid })
		.then((user) => {
			if (user) {
				res.status(200).json({
					_id: user._id,
					username: user.username,
					currency: user.currency,
				});
			} else {
				res.status(400).send("user does not exist");
			}
		})
		.catch((err) => {
			res.status(500).json({
				status: "error",
				error: err,
			});
		});
});

router.post("/transaction", async (req, res) => {
	const session = await User.startSession();
	await session
		.withTransaction(async () => {
			await User.updateOne(
				{
					username: req.body.sender,
				},
				{
					$inc: {
						currency: -req.body.currency,
					},
				}
			);
			await User.updateOne(
				{
					username: req.body.receiver,
				},
				{
					$inc: {
						currency: req.body.currency,
					},
				}
			);
		})
		.then(() => {
			res.status(200).json({ message: "Transaction completed" });
		})
		.catch((err) => {
			res.status(500).send(err);
		});
	session.endSession();
});

router.put("/add/:userid", (req, res) => {
	userid = req.params.userid;
	User.findById(userid, (err, user) => {
		if (err) {
			console.log(err);
			return handleError(err);
		}
		console.log("user", user);
	
		user.currency = user.currency + req.body.currency;
	
		user.save((err, updatedUser) => {
			if (err) {
				return handleError(err);
			}
		});
	}).then((user) => {
		if (!auctiondetail) {
			return res.status(404).send({ message: "user not found with id " + userid });
		}
		res.send(user);
		// res.status(200).json({ message: "Currency updated" });
	}).catch((err) => {
		if (err.kind === "ObjectId") {
			return res.status(404).send({ message: "user not found with id " + userid });
		}
		return res.status(500).send({
			message: err.message,
		});
	});
});

module.exports = router;