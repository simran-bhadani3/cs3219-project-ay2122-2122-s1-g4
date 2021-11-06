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


## Date time format
"start_time": "2021-11-01T03:53:58.358Z",
"end_time": "2021-11-01T22:53:58.358Z",
This is in UTC time, can check current time here : https://www.timeanddate.com/worldclock/timezone/utc


## Image upload and download
Have attached the postman files
1. Upload:
    -  POST to /api/auctiondetails/upload/
    -  POST body should be in from-data format with the following key-value pairs:
        1. key: "file", value: file uploaded by user
        1. key: "id", value: id of the auctiondetails for which the file has been uploaded
1. Download:
    - GET from /api/auctiondetails/download/:id