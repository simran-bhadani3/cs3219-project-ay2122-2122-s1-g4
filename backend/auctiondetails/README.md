## To run auctiondetails server on localhost:
run 'nodemon start'
Go to http://localhost:4000 to access the route.

## To run auctiondetails server on localhost:
### Postman collections file can be found in folder
GET /api/auctiondetails: will give all auctiondetails stored in database
GET /api/auctiondetails/<auctiondetails>: will give a specific auctiondetails with auctiondetails_id.
POST /api/auctiondetails: user can create a new auctiondetail
PATCH /api/auctiondetails/<auctiondetails>: update a auctiondetail partially
DELETE /api/auctiondetails/<auctiondetails>: delete a auctiondetail
PUT /api/auctiondetails/<auctiondetails>: update a auctiondetail completely
