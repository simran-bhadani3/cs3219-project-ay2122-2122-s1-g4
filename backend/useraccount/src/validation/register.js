const validator = require("validator");
module.exports = function validateNewAccount(data) {
	// console.log("reached");
	let errors = {};
	errors.valid = "true";
	//username validation
	//check if username < 30 characters
	if (!validator.isLength(data.username, { max: 30 })) {
		(errors.username = "Username must not be longer than 30 characters"),
			(errors.valid = "false");
	}
	if (!validator.isLength(data.username, { min: 6 })) {
		(errors.username = "Username must be at least 6 characters"),
			(errors.valid = "false");
	}
	//check if username is present
	if (
		data.username == undefined ||
		data.username == null ||
		(typeof data.username == "string" && data.username.trim().length === 0)
	) {
		(errors.username = "Username is required"), (errors.valid = "false");
	}
	//email validation
	//check if domain is valid
	if (
		!validator.matches(
			validator.normalizeEmail(data.email),
			"e[0-9]{7}@u.nus.edu"
		)
	) {
		(errors.email = "Email must be valid and have the domain u.nus.edu"),
			(errors.valid = "false");
	}

	//check if email is present
	if (
		data.email == undefined ||
		data.email == null ||
		(typeof data.email == "string" && data.email.trim().length === 0)
	) {
		(errors.email = "Email is required"), (errors.valid = "false");
	}
	//password validation
	//password must be at least 6 characters
	if (
		!validator.isStrongPassword(data.password, {
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		})
	) {
		(errors.password =
			"Password must be at least 8 characters long and contain a number, symbol, uppercase character and lowercase character."),
			(errors.valid = "false");
	}
	//check if password is present
	if (
		data.password == undefined ||
		data.password == null ||
		(typeof data.password == "string" && data.password.trim().length === 0)
	) {
		(errors.password = "Password is required"), (errors.valid = "false");
	}
	//confirm password validation
	//check if confirm password equals password
	if (!validator.equals(data.password, data.confirmpassword)) {
		(errors.confirmpassword = "Passwords must match"), (errors.valid = "false");
	}
	//check if confirm password is present
	if (
		data.confirmpassword == undefined ||
		data.confirmpassword == null ||
		(typeof data.confirmpassword == "string" &&
			data.confirmpassword.trim().length === 0)
	) {
		(errors.confirmpassword = "Confirm Password is required"),
			(errors.valid = "false");
	}
	return errors;
};
