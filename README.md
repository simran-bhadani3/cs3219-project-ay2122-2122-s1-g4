# CS3219: e_Auction Website

# FRONTEND

## To run the frontend:

```
cd frontend
yarn start
```

## To add packages:

```
yarn add all
```

or

```
yarn add {PACKAGE_NAME}, e.g. yarn add formik
```

## Things to note when coding the frontend:

- Use of components (eg. eButton under components file)
- Use of theme (h1/primary color under theme.js) and maketheme for styling  
- Do not edit theme.js 
- Use of material ui components (e.g.: Grid, Typography)
- useEffect, useState, useLocation for updating of UI, saving of state and navigation


## Chat functionality

Open http://localhost/auction/{any room name} to join or create a new auction room
This is a crude implementation of chat
Works without authentication for now

## Run mvp using shell script

Go to root folder and run 'docker-compose build' to build images
Then from wsl/linux terminal, run ./k8/setup1.sh
Change sh files to CLRF for windows, LF for unix


## Testing app
1. Register account
2. Login
(Steps 3-4 has to be done manually using postman for now since Michelle is still working on the auction creation pages)
3. Create auction using user's unique _id
4. Create auction instance in fire base using auction's unique _id and user's _id using the auctionroom api
5. Go the the auction room instance http://localhost:8080/auction/:auctionid
6. Once inside, end auction button should show if you are the owner, other users will not see it.
7. You can chat using the chatbox, but there is a rate limit of 5 messages in 10 seconds
8. Bid must be higher than minimum or highest + 20, whichever is higher
9. End auction will make the auction room non-functional and process the transaction between winner and owner
10. Known bugs: Do not start bid with 0 e.g 0100