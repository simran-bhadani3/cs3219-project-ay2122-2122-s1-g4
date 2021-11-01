const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
	},
	currency: {
		type: Number,
		required: true,
	},
	//can delete later if not needed
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = User = mongoose.model("user", UserSchema);
