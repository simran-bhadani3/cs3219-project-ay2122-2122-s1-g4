const express = require("express");
const mongoose = require("mongoose");

const dbUrl = process.env.backend || "mongodb://127.0.0.1:27017/useraccounts";
console.log(dbUrl);
//const dbUrl = "mongodb://host.docker.internal:27017/useraccounts";
mongoose
	.connect(dbUrl, {
		useNewUrlParser: true,
	})
	.then(() => {
		console.log("Successfully connected to the database.");
	})
	.catch((error) => {
		console.log("Couldn't connect to the database.", error);
		process.exit();
	});

require("./src/models/User");

const currencyManagement = require("./src/routes/CurrencyManagement");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use("/api/currency", currencyManagement);

const port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log(`currencymanagement server is listening on port ${port}`);
})

module.exports.app = app;
