const axios = require("axios");
const express = require("express");
const router = express.Router();

// note that you need the http:// part if youre not using localhost, for axios requests
const local = "localhost";
const deployed = "http://...";
const hostUrl = local
const endpoint1 = "/api/auctiondetails";
const endpoint2 = "/api/currency";
const endpoint3 = "/api/user";




// axios.defaults.baseURL = hostUrl;

router.get("/:userId", async (req, res) => {
    try {
        axios.defaults.validateStatus = function (status) {
            return true;
        }; // i do not want axios to throw errors for any error codes, just forward to front end / manipulate it as is
        const {userId} = req.params;
        console.log(`userid: ${userId}`);
        console.log(`received req:\n${JSON.stringify(req.url)}`);
        console.log(`received req headers:\n${JSON.stringify(req.headers)}`);
        const AUTH_HEADER = req.headers['authorization'];

        // technically the api gateway is currently catching auth errors...
        console.log("authorization header: " + AUTH_HEADER);

        const AUTH_TOKEN = (AUTH_HEADER && AUTH_HEADER.split(" ")[1]) || "";

        const instance = axios.create({
            validateStatus: function (status) {
                return true;
            }
        });
        instance.defaults.headers.common['Authorization'] = AUTH_HEADER;
        
        
        const jsonResponseFromTestApi = await instance({
            url: `/api/currency/${userId}`,
			method: "get",
		})
        .then(axiosRes => {
            // if (!axiosRes.response) { throw axiosRes; }

            // console.log(axiosRes)
            const json = {
                // "data": axiosRes.response.data,
                "status": axiosRes.status,
                "message": `${axiosRes.status} ${axiosRes.statusText}`
            };
            return json;
        });

        console.log("here");

        console.log(`test: ${jsonResponseFromTestApi}`)
        const combineJson = {
            "testApi": jsonResponseFromTestApi,
            "userApi": null, 
            "currencyApi": null
        }; // we need to think about how to format the aggregated response

		res.status(200).json(combineJson);
	} catch (err) {
        console.log(err);
        console.log("error caught")
		res.status(500).send(err.message);
	}
})

module.exports = router;