const express = require("express");

const app = express();

//changed to 3003 to prevent overlapping
const port = process.env.PORT || 3003; // originally 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const auctionRoom = require("./src/routes/AuctionRoom");

app.use("/api/room", auctionRoom);

app.listen(port, function (err, data) {
	if (err) {
		console.log(err);
	} else {
		console.log("connected");
	}
});

