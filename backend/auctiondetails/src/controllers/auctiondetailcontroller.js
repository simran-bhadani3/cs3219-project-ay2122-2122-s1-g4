const Auctiondetail = require("../models/auctiondetailmodel.js");
const mongoose = require("mongoose");
const firebase = require("../../firebase/db.js");
const fs = require('fs')
// const firestore = firebase.firestore();
require("firebase/storage");
global.XMLHttpRequest = require("xhr2");
// Retrieve and return all auctiondetails from the database.
exports.findAll = (req, res) => {
	Auctiondetail.find()
		.then((auctiondetail) => {
			res.send(auctiondetail);
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message ||
					"Something went wrong while getting list of auctiondetails.",
			});
		});
};
// Create and Save a new Auction Detail
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: "Please fill all required fields"
        });
    }

    var id = new mongoose.Types.ObjectId();
    // Create a new Auctiondetail
    const auctiondetail = new Auctiondetail({
        room_display_name: req.body.room_display_name,
        auction_item_name: req.body.auction_item_name,
        owner_id: req.body.owner_id,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        description: req.body.description,
        increment: req.body.increment,
        minbid: req.body.minbid,
        category: req.body.category
    });
    // Save Auctiondetail in the database
    auctiondetail.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            if (err.message.split(' ')[0] === "E11000") {
                return res.status(400).send({message: "This auction room name is taken. Please try another one."});
            }
            res.status(500).send({
                message: err.message || "Something went wrong while creating new auctiondetail."
            });
        });
};

exports.uploadImage = async (req, res) => {
	const storage = firebase.storage().ref();
	const image = req.body['file'];
	const bimage = image.replace("data:image/jpeg;base64,", "");
	const detailsid = req.params.id;
	console.log(detailsid)
	// console.log(image);
	const extension = image.substr(11, 15);
	console.log(extension);
	// const extension = image.originalname.split(".")[1];
	// if (extension != "jpeg") {
	// 	return res.status(400).send({
	// 		message: "Only jpeg format is allowed",
	// 	});
	// } else {
		// console.log(detailsid);
		// console.log(imageDecoded);
		const filename = detailsid;
		try {
			const storageRef = storage.child(filename);
			const snapshot = await storageRef.putString(bimage, 'base64', {contentType:'image/jpeg'});
			// const snapshot = await storageRef.put(imageDecoded);
			res.status(200).json({ message: "File successfully uploaded" });
		} catch (error) {
			console.log(error)
			return res.status(500).send({
				message: error || "Error uploading image",
			});
		}
	// }
};

exports.downloadImage = async (req, res) => {
	const filename = req.params.id + ".jpeg";
	try {
		const url = await firebase.storage().ref(filename).getDownloadURL();
		res.status(200).json({ url: url });
	} catch (error) {
		return res.status(500).send({
			message: error || "Error downloading image",
		});
	}
};

// Retrieve all auctions with user id
exports.findByUser = (req, res) => {
	Auctiondetail.find({ owner_id: req.params.userid })
		.then((auctiondetail) => {
			if (auctiondetail.length === 0) {
				return res.status(404).send({
					message: "Auctiondetails not found with userid " + req.params.userid,
				});
			}
			res.send(auctiondetail);
		})
		.catch((err) => {
			if (err.kind === "ObjectId") {
				return res.status(404).send({
					message: "Auctiondetails not found with user id " + req.params.userid,
				});
			}
			return res.status(500).send({
				message:
					"Error getting auctiondetails with user id " + req.params.userid,
			});
		});
};

// Retrieve all auctions that are not over
exports.findFuture = (req, res) => {
	const now = new Date();
	Auctiondetail.find({ end_time: { $gt: now } })
		.then((auctiondetail) => {
			if (!auctiondetail) {
				return res.status(204).send({
					message: "No future auctions",
				});
			}
			res.send(auctiondetail);
		})
		.catch((err) => {
			return res.status(500).send({
				message: "Error getting auctiondetails",
			});
		});
};

// Retrieve all auctions by minbid / category / search by name
exports.filterAndSearch = (req, res) => {
	const query = req.query;
	const data = {};
	if (query.room_display_name) {
		data.room_display_name = new RegExp(query.room_display_name, "i");
	}
	if (!query.showAll || query.showAll === "false") {
		const now = new Date();
		data.end_time = { $gt: now };
	}
	if (query.auction_item_name) {
		data.auction_item_name = new RegExp(query.auction_item_name, "i");
	}
	if (query.lowerbound || query.upperbound) {
		data.minbid = {};
		if (query.lowerbound) {
			data.minbid["$gte"] = req.query.lowerbound;
		}
		if (query.upperbound) {
			data.minbid["$lte"] = req.query.upperbound;
		}
	}
	if (query.category) {
		data.category = req.query.category;
	}
	Auctiondetail.find(data)
		.then((auctiondetail) => {
			if (!auctiondetail) {
				return res.status(204).send({
					message: "No auctions found" + console.log(req.query.lowerbound),
				});
			}
			res.send(auctiondetail);
		})
		.catch((err) => {
			console.log("err", err);
			return res.status(500).send({
				message: "Error getting auctiondetails",
			});
		});
};

// Retrieve all auctions by minbid
exports.findRange = (req, res) => {
	Auctiondetail.find({
		minbid: { $gte: req.query.lowerbound, $lte: req.query.upperbound },
	})
		.then((auctiondetail) => {
			if (!auctiondetail) {
				return res.status(204).send({
					message: "No auctions found" + console.log(req.query.lowerbound),
				});
			}
			res.send(auctiondetail);
		})
		.catch((err) => {
			return res.status(500).send({
				message: "Error getting auctiondetails",
			});
		});
};

// Retrieve all auctions by category
exports.findCategory = (req, res) => {
	Auctiondetail.find({ category: req.params.category })
		.then((auctiondetail) => {
			if (!auctiondetail) {
				return res.status(204).send({
					message: "No auctions found",
				});
			}
			res.send(auctiondetail);
		})
		.catch((err) => {
			return res.status(500).send({
				message: "Error getting auctiondetails",
			});
		});
};

// Find a single Auctiondetail with a id
exports.findOne = (req, res) => {
	Auctiondetail.findById(req.params.id)
		.then((auctiondetail) => {
			if (!auctiondetail) {
				return res.status(404).send({
					message: "Auctiondetail not found with id " + req.params.id,
				});
			}
			res.send(auctiondetail);
		})
		.catch((err) => {
			if (err.kind === "ObjectId") {
				return res.status(404).send({
					message: "Auctiondetail not found with id " + req.params.id,
				});
			}
			return res.status(500).send({
				message: "Error getting auctiondetail with id " + req.params.id,
			});
		});
};

// Update a Auctiondetail identified by the id in the request
exports.update = (req, res) => {
	// Validate Request
	if (!req.body) {
		return res.status(400).send({
			message: "Please fill all required fields",
		});
	}
	// Find auctiondetail and update it with the request body
	Auctiondetail.findByIdAndUpdate(
		req.params.id,
		{
			room_display_name: req.body.room_display_name,
			auction_item_name: req.body.auction_item_name,
			owner_id: req.body.owner_id,
			start_time: req.body.start_time,
			end_time: req.body.end_time,
			description: req.body.description,
			increment: req.body.increment,
			minbid: req.body.minbid,
			category: req.body.category,
		},
		{ new: true }
	)
		.then((auctiondetail) => {
			if (!auctiondetail) {
				return res.status(404).send({
					message: "auctiondetail not found with id " + req.params.id,
				});
			}
			res.send(auctiondetail);
		})
		.catch((err) => {
			if (err.kind === "ObjectId") {
				return res.status(404).send({
					message: "auctiondetail not found with id " + req.params.id,
				});
			}
			return res.status(500).send({
				message: err.message,
			});
		});
};
// Delete a Auctiondetail with the specified id in the request
exports.delete = (req, res) => {
    Auctiondetail.findByIdAndRemove(req.params.id)
        .then(auctiondetail => {
            if (!auctiondetail) {
                return res.status(404).send({
                    message: "User does not have any auction details" + req.params.id
                });
            }
            res.send({ message: "auctiondetail deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "auctiondetail not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete auctiondetail with id " + req.params.id
            });
        });
};

exports.findByOwner = (req, res) => {
    const userId = req.params.userId;
    const errorMsg404 = `No auctiondetails found for user with userId ${userId}. Perhaps none have been created yet?`

    Auctiondetail.find({owner_id: userId})
        .then(auctiondetail => {
            if (!auctiondetail) {
                return res.status(404).send({
                    message: errorMsg404
                });
            }
            res.send(auctiondetail);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: errorMsg404
                });
            }
            return res.status(500).send({
                message: `Error getting auctiondetail for user with userId ${userId}`
            });
        });
};
