const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
var cors = require('cors')
router.use(cors())
const validateLogin = require("../validation/login");
const validateNewAccount = require("../validation/register");
const User = require("../models/User");
const keys = require("../config/keys");

//registering for a new account
router.post("/register", (req, res) => {
	let errors = validateNewAccount(req.body);
	try {
		User.findOne({ email: req.body.email }).then((user) => {
			if (user) {
				errors.email = "Email already exists";
				errors.valid = "false";
			}
		});
	} catch (err) {
		res.status(400).send(err);
	}

	try {
		User.findOne({ username: req.body.username }).then((user) => {
			if (user) {
				errors.username = "Username already exists";
				errors.valid = "false";
			}
		});
	} catch (err) {
		res.status(400).send(err);
	}

	if (errors.valid == "false") {
		return res.status(400).json(errors);
	}
	const user = new User({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
	});
	try {
		bcrypt.genSalt(15, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) {
					throw err;
				} else {
					user.password = hash;
					user
						.save()
						.then((user) => res.json(user))
						.catch((err) => console.log(err));
				}
			});
		});
	} catch (err) {
		res.status(400).send(err);
	}
});

//logging in
router.post("/login", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	let errors = validateLogin(req.body);
	if (errors.valid == "false") {
		return res.status(400).json(errors);
	}
	User.findOne({ email: email }).then((user) => {
		if (!user) {
			errors.combination = "User and password combination is incorrect.";
			errors.valid = "false";
			return res.status(400).json(errors);
		} else {
			bcrypt.compare(password, user.password).then((same) => {
				if (same) {
					const jwtPayload = {
						username: user.username,
						email: user.email,
					};
					jwt.sign(
						jwtPayload,
						keys.jwtKey,
						{ expiresIn: 5 * 24 * 60 * 60 }, //jwt expires in 5 days
						(err, jwtToken) => {
							res.json({
								username: user.username,
								id: user.id,
								jwtToken: "Bearer " + jwtToken,
							});
						}
					);
				} else {
					errors.combination = "User and password combination is incorrect.";
					errors.valid = "false";
					return res.status(400).json(errors);
				}
			});
		}
	});
});

// authenticating using jwt
//, successRedirect: '/all' redirect to homepage
router.get(
	"/user",
	passport.authenticate("jwt", { session: false  }),
	(req, res) => {
		res.status(200).send(
			{
				status: "Authorized",
				userid: req.user
			});
	}
);

module.exports = router;
