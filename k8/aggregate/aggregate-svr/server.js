const axios = require("axios");
const express = require("express");
const app = express();

const hostUrl = "localhost"// "kubernetes.docker.internal";
const endpoint1 = "/api/auctiondetails";
const endpoint2 = "/api/currency";
app.use(express.json());
// enable cors
const cors = require('cors');
app.use(cors())

app.get("/api/agg/:userId", async (req, res) => {
    try {
        console.log(`received req: ${JSON.stringify(req.url)}`);
        
        const jsonResponseFromTestApi = await axios({
            host: "kubernetes.docker.internal", //"localhost",
            url: "/test-auth",
			method: "get",
		})
        .catch(axiosRes => {
            // bug: there might be other errors than just a not 200 ok status code
            // e.g. cant connect to host
            // so need to handle them differently...
            console.log(axiosRes)
            const json = {
                "data": axiosRes.response.data,
                "status": axiosRes.response.status,
                "message": `${axiosRes.response.status} ${axiosRes.response.statusText}`
            };
            return json;
        });

        console.log(`test: ${jsonResponseFromTestApi}`)
        const combineJson = {
            "testApi": jsonResponseFromTestApi,
            "userApi": null, 
            "currencyApi": null
        }; // todo we need to think about how to format the aggregated response

		res.status(200).json(combineJson);
	} catch (err) {
        console.log(err);
		res.status(500).send(err.message);
	}
})


app.get("/api/test-agg", async (req, res) => {
    try {
        const url = "localhost/test-auth";
        const data = await fetch(url)
            .then(response => response.json())

        res.send(data);
    } catch (ex) {
        res.status(500).send(ex.message)
    }
})

const port = process.env.PORT || 8085; 

const server = app.listen(port, () => {
    console.log(`listening on port ${port}...`);
}); 

// Export our app for testing purposes
module.exports = server;