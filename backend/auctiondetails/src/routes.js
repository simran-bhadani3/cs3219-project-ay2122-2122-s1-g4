const express = require('express')
const multer = require('multer');
const router = express.Router()
const auctiondetailcontroller = require('./controllers/auctiondetailcontroller');
//set up multer to get photos
const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage: storage }).single('file');

// Retrieve all auctions
router.get('/', auctiondetailcontroller.findAll);

// Create a new auction
router.post('/', auctiondetailcontroller.create);

// Upload to firebase cloud
router.post('/upload/:id', uploadMiddleware, auctiondetailcontroller.uploadImage);

//Get download URL
router.get('/download/:id', auctiondetailcontroller.downloadImage);

// Retrieve all auctions by category and price or search by name
router.get('/filterandsearch', auctiondetailcontroller.filterAndSearch);
// Retrieve all auctions by price
router.get('/pricerange', auctiondetailcontroller.findRange);
// Retrieve all auctions that are not over
router.get('/notover', auctiondetailcontroller.findFuture);


// Retrieve an auction's details with id
router.get('/:id', auctiondetailcontroller.findOne);
// Retrieve all auctions with user id
router.get('/user/:userid', auctiondetailcontroller.findByUser);


// Retrieve all auctions by category
router.get('/category/:category', auctiondetailcontroller.findCategory);


// Update a auction with id
router.put('/:id', auctiondetailcontroller.update);
router.patch('/:id', auctiondetailcontroller.update);

// Delete a auction with id
router.delete('/:id', auctiondetailcontroller.delete);
module.exports = router