## To run auctiondetails server on localhost:

run the following commands:

1. `cd backend\auctiondetails`(if you're not already on this folder)
2. `npm i`
3. `mongod` in one terminal or `brew services start mongodb-community`
4. `nodemon start` in another terminal
   Go to http://localhost:4000 to access the route.

## To run unit tests

run `npm test`

## To run auctiondetails server on localhost:

### Postman collections file can be found in folder

1. GET /api/auctiondetails: will give all auctiondetails stored in database
2. GET /api/auctiondetails/<auctiondetails>: will give a specific auctiondetails with auctiondetails_id.
3. POST /api/auctiondetails: user can create a new auctiondetail
4. PATCH /api/auctiondetails/<auctiondetails>: update a auctiondetail partially
5. DELETE /api/auctiondetails/<auctiondetails>: delete a auctiondetail
6. PUT /api/auctiondetails/<auctiondetails>: update a auctiondetail completely

### Filter functions

1. GET /api/auctiondetails/category/:category Retrieve all auctions by category
2. GET /api/auctiondetails/user/:userid Retrieve all auctions with user id
3. GET /api/auctiondetails/pricerange Retrieve all auctions by price (Add querys strings e.g. /api/auctiondetails/pricerange?lowerbound=100&upperbound=200)
4. GET /api/auctiondetails/notover Retrieve all auctions that are not over
5. GET /api/auctiondetails/filter Retrieve all auctions that are not over and filter by category and price (Add querys strings e.g. /api/auctiondetails/filter?lowerbound=10&upperbound=200&category=Books)

## Date time format

"start_time": "2021-11-01T03:53:58.358Z",
"end_time": "2021-11-01T22:53:58.358Z",
This is in UTC time, can check current time here : https://www.timeanddate.com/worldclock/timezone/utc

## Image upload and download

Have attached the postman files

1. Upload:
   - POST to /api/auctiondetails/upload/
   - POST body should be in from-data format with the following key-value pairs:
     1. key: "file", value: file uploaded by user
     1. key: "id", value: id of the auctiondetails for which the file has been uploaded
1. Download:
   - GET from /api/auctiondetails/download/:id
