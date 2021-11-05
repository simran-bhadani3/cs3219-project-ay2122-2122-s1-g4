const Auctiondetail = require('../models/auctiondetailmodel.js');
const mongoose = require('mongoose');
// Retrieve and return all auctiondetails from the database.
exports.findAll = (req, res) => {
    Auctiondetail.find()
        .then(auctiondetail => {
            res.send(auctiondetail);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Something went wrong while getting list of auctiondetails."
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
// Find a single Auctiondetail with a id
exports.findOne = (req, res) => {
    Auctiondetail.findById(req.params.id)
        .then(auctiondetail => {
            if (!auctiondetail) {
                return res.status(404).send({
                    message: "Auctiondetail not found with id " + req.params.id
                });
            }
            res.send(auctiondetail);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Auctiondetail not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error getting auctiondetail with id " + req.params.id
            });
        });
};
// Update a Auctiondetail identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        return res.status(400).send({
            message: "Please fill all required fields"
        });
    }
    // Find auctiondetail and update it with the request body
    Auctiondetail.findByIdAndUpdate(req.params.id, {
        room_display_name: req.body.room_display_name,
        auction_item_name: req.body.auction_item_name,
        owner_id: req.body.owner_id,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        description: req.body.description,
        increment: req.body.increment,
        minbid: req.body.minbid
    }, { new: true })
        .then(auctiondetail => {
            if (!auctiondetail) {
                return res.status(404).send({
                    message: "auctiondetail not found with id " + req.params.id
                });
            }
            res.send(auctiondetail);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "auctiondetail not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: err.message
            });
        });
};
// Delete a Auctiondetail with the specified id in the request
exports.delete = (req, res) => {
    Auctiondetail.findByIdAndRemove(req.params.id)
        .then(auctiondetail => {
            if (!auctiondetail) {
                return res.status(404).send({
                    message: "auctiondetail not found with id " + req.params.id // want to change to "user does not have any auction details"
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