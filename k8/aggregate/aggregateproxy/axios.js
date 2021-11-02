const axios = require("axios");
const express = require("express");
const router = express.Router();

// note that you need the http:// part if youre not using localhost, for axios requests
const deployedUrl = "http://...";
const endpoint1 = "/api/auctiondetails";
const endpoint2 = "/api/currency";
const endpoint3 = "/api/user";

// dont need to set host for localhost
if (process.env.NODE_ENV === "production")
    axios.defaults.baseURL = deployedUrl;

// i do not want axios to throw errors for any error codes, only want promise rejections for actual rejections 
axios.defaults.validateStatus = function (status) {
    return true;
}; 

router.get("/:userId", async (req, res) => {
    try {
        const {userId} = req.params;
        console.log(`userid: ${userId}`);
        console.log(`received req:\n${JSON.stringify(req.url)}`);
        console.log(`received req headers:\n${JSON.stringify(req.headers)}`);

        const AUTH_HEADER = req.headers['authorization'] || "";

        // technically the api gateway is currently catching auth errors...
        // console.log("authorization header: " + AUTH_HEADER);

        const instance = axios.create();
        instance.defaults.headers.common['Authorization'] = AUTH_HEADER;     

        const currencyApiRes = await getCurrencyApi(instance, userId);

        const combineJson = {
            "currencyApi": currencyApiRes,
            "userApi": null, 
            "auctiondetailsApi": null
        }; // we need to think about how to format the aggregated response

		res.status(200).json(combineJson);
	} catch (err) {
        console.log(err);
        console.log("error caught")
		res.status(500).send(err.message);
	}
})

async function getCurrencyApi(instance, userId) {    
    const currencyApiRes = await instance({
        url: `/api/currency/${userId}`,
        method: "get",
    })
    .then(axiosRes => {
        console.log(axiosRes)
        const json = {
            "data": axiosRes.data,
            "status": axiosRes.status,
            "message": `${axiosRes.status} ${axiosRes.statusText}`
        };
        return json;
    });
    return currencyApiRes;
}

function validateIdentity() {

}

function auth(req, res, next) {
    // 
    // get from localhost/api/user/user
    // from the response, get headers (userid, username)
    // and then call the relevant api accordingly 


    next();
}

module.exports = router;