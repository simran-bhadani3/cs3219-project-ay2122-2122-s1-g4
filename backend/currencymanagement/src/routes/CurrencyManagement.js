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

router.post("/add", (req, res) => {
	userid = req.body.userid;
	User.findOne({ _id: userid })
		.then((user) => {
			if (user) {
				User.updateOne(
					{ _id: userid },
					{
						$inc: {
							currency: req.body.currency,
						},
					}
				)
					.then(() => {
						res.status(200).json({
							currency: "currency updated",
						});
					})
					.catch((err) => {
						res.status(500).json({
							status: "error",
							error: err,
						});
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

module.exports = router;
