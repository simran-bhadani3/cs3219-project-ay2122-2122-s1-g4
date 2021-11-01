# Starting the server
`npm install nodemon`

Run `npm run dev` to start with nodemon

# Check connection
`connected` will be logged in the console when the server is ready and listening.

# Insert a new bid
POST to http://localhost:3000/api/room/newbid
```
{
    "username": "user1",
    "bid" : 124,
    "roomname": "room1"
}
```

# Get current bid of a user

GET from http://localhost:3000/api/room/getbid/:roomname/:username

```
http://localhost:3000/api/room/getbid/room1/user1
```


# Get highest bid value of a room

GET from http://localhost:3000/api/room/gethighest/:roomname

```
http://localhost:3000/api/room/gethighest/room1
```

# Add a new auction room
POST to http://localhost:3000/api/room/newroom

```
{
    "roomname": "roomxx",
    "owner": "owner1"
}
```

# Delete an auction room

DELETE http://localhost:3000/api/room/deleteroom/:roomname
