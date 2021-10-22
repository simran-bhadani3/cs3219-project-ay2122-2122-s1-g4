const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const dbUrl = "mongodb://127.0.0.1:27017/useraccounts";
mongoose.Promise = global.Promise;
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

require("./src/config/passport.js")(passport);

const userAccounts = require("./src/routes/User");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/user", userAccounts);

const port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log(`useraccount server is listening on port ${port}`);
});
