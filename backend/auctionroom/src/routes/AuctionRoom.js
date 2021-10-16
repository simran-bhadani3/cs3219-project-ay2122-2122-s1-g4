const express = require("express");
const router = express.Router();
const setters = require("../../firebase/setData");
const getters = require("../../firebase/getData");

router.post("/newbid/", (req, res) => {
	setters.setNewBid(req.body, res);
});

router.get("/getbid/:roomname/:username", (req, res) => {
	getters.getBid(req, res);
});

module.exports = router;
