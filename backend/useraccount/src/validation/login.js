const validator = require("validator");
module.exports = function validateLogin(data) {
	let errors = {};
	errors.valid = "true";
	//check if email has been entered
	if (
		data.email == undefined ||
		data.email == null ||
		(typeof data.email == "string" && data.email.trim().length === 0)
	) {
		(errors.email = "Email is required"), (errors.valid = "false");
	}
	//check if email is of the correct format
	if (
		!validator.matches(
			validator.normalizeEmail(data.email),
			"e[0-9]{7}@u.nus.edu"
		)
	) {
		(errors.email = "Email must be a valid NUS email"),
			(errors.valid = "false");
	}
	//check if password has been entered
	if (
		data.password == undefined ||
		data.password == null ||
		(typeof data.password == "string" && data.password.trim().length === 0)
	) {
		(errors.password = "Password is required"), (errors.valid = "false");
	}
	return errors;
};
