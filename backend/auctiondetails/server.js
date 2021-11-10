const express = require("express");
const cors = require('cors') // import cors
// create express app
const app = express();
// Setup server port
const port = process.env.PORT || 4000;
// parse requests of content-type - application/x-www-form-urlencoded
// parse requests of content-type - application/json
app.use(express.json());
app.use(cors());
// app.use(express.urlencoded({extended: false}));
// Configuring the database
const dbConfig = require("./config/db.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
// Connecting to the database
//CHANGE TO dbConfig.url for local deployment!
const dbUrl = process.env.backend || dbConfig.url;
console.log(dbUrl);
mongoose
	.connect(dbUrl, {
		useNewUrlParser: true,
	})
	.then(() => {
		console.log("Successfully connected to the database");
	})
	.catch((err) => {
		console.log("Could not connect to the database.", err);
		process.exit();
	});

app.options('/', cors()) // enable pre-flight request for DELETE request
app.delete('/', cors(), function (req, res, next) {
	res.json({ msg: 'This is CORS-enabled for all origins!' })
})

app.post('/', cors(), function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost,\
	 https://cs3219-project-ay2122-2122-s1-g4-frontend-bsyylql4ka-as.a.run.app, https://aggproxy-bsyylql4ka-as.a.run.app, http://34.124.176.116/,\
	 http://34.126.147.222/auctionroom" );
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.setHeader("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Accept");
	// res.header['Access-Control-Allow-Origin'] = '*'
	// res.header['Access-Control-Allow-Headers'] = 'Content-Type'
	res.json({ msg: 'This is CORS-enabled for all origins!' })
})


// define a root/default route
app.get("/", (req, res) => {
	res.json({ message: "Hello World" });
});

// ........

// Require Users routes
const auctionDetailRoutes = require("./src/routes");

// uploading encoding
// app.use(express.urlencoded({ extended: false }));
// app.post('/api/auctiondetails/upload', express.urlencoded({ extended: false }), auctionDetailRoutes)
// using as middleware
app.use("/api/auctiondetails", auctionDetailRoutes);
// ........

// listen for requests
module.exports = app.listen(port, () => {
	console.log(`Node server is listening on port ${port}`);
});
