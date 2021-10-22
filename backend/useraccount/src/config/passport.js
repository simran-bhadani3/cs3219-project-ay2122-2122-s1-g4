const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");

const User = mongoose.model("user");

const keys = require("./keys");

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: keys.jwtKey,
};

module.exports = (passport) => {
	passport.use(
		new JwtStrategy(opts, function (jwt_payload, done) {
			User.findOne({ email: jwt_payload.email }, function (err, user) {
				if (err) {
					return done(err, false);
				}
				if (user) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			});
		})
	);
};
