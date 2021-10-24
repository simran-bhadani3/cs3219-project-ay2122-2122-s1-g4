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

## Run mvp using docker-compose

Go to root folder and run 'docker-compose build' to build images
Run 'docker-compose up' to run all containers