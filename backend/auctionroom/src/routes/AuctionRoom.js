const express = require("express");
const router = express.Router();
const setters = require("../../firebase/setData");
const getters = require("../../firebase/getData");
const deleters = require("../../firebase/deleteData");


router.post("/newbid/", (req, res) => {
	setters.setNewBid(req.body, res);
});

router.post("/newroom/", (req, res) => {
	setters.createNewRoom(req.body, res);
});

router.get("/getbid/:roomname/:username", (req, res) => {
	getters.getBid(req, res);
});

router.delete("/deleteroom/:roomname", (req, res) => {
	deleters.deleteRoom(req, res);
});

module.exports = router;
