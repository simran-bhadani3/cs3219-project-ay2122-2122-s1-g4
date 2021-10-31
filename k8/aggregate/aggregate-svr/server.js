const axios = require("axios");
const express = require("express");
const app = express();

const hostUrl = "localhost"// "kubernetes.docker.internal";
const endpoint1 = "/api/auctiondetails";
const endpoint2 = "/api/currency";
app.use(express.json());

// app.use("/", entry);

app.get("/api/agg/:userId", async (req, res) => {
    try {
		// const createdAuctions = await axios({
        //     // todo do we need to get all auction rooms by user? 
		// 	url: `${hostUrl}${endpoint1}/userId`,
		// 	method: "get",
		// });
        // const currentBalance = 
        // const userDetails //?

        // const testGetAllAuctions = await axios({
		// 	url: `${hostUrl}${endpoint1}`,
		// 	method: "get",
		// });
        
        const testGetFrontend = await axios({
			url: `${hostUrl}/test-auth`,
			method: "get",
		});

        const combine = testGetFrontend;

		res.status(200).json(combine.data);
	} catch (err) {
        console.log(err);
		res.status(500).json({ message: err });
	}
})


const port = process.env.PORT || 8085; 


const server = app.listen(port, () => {
    console.log(`listening on port ${port}...`);
}); 

// Export our app for testing purposes
module.exports = server;