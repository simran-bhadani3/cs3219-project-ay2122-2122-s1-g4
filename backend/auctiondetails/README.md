## To run auctiondetails server on localhost:
run the following commands:
1. `cd backend\auctiondetails`(if you're not already on this folder)
2. `npm i`
3. `mongod` in one terminal
3. `nodemon start` in another terminal 
Go to http://localhost:4000 to access the route.

## To run unit tests
run `npm test`

## To run auctiondetails server on localhost:
### Postman collections file can be found in folder
GET /api/auctiondetails: will give all auctiondetails stored in database
GET /api/auctiondetails/<auctiondetails>: will give a specific auctiondetails with auctiondetails_id.
POST /api/auctiondetails: user can create a new auctiondetail
PATCH /api/auctiondetails/<auctiondetails>: update a auctiondetail partially
DELETE /api/auctiondetails/<auctiondetails>: delete a auctiondetail
PUT /api/auctiondetails/<auctiondetails>: update a auctiondetail completely
