const express = require('express')
const router = express.Router()
const auctiondetailcontroller = require('./controllers/auctiondetailcontroller');

// Retrieve all rooms
router.get('/', auctiondetailcontroller.findAll);

// Create a new room
router.post('/', auctiondetailcontroller.create);

// Retrieve a room user with id
router.get('/:id', auctiondetailcontroller.findOne);

// Update a room with id
router.put('/:id', auctiondetailcontroller.update);
router.patch('/:id', auctiondetailcontroller.update);

// Delete a room with id
router.delete('/:id', auctiondetailcontroller.delete);
module.exports = router