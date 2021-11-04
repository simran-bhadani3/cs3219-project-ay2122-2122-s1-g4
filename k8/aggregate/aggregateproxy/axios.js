const axios = require("axios");
const express = require("express");
const router = express.Router();

// note that you need the http:// part if youre not using localhost, for axios requests
// ! duplication here
const DEPLOYED_URL = "http://...";
const PATH_AUCTIONDETAILS = "/api/auctiondetails/owner";
const PATH_CURRENCY = "/api/currency";
const endpoint3 = "/api/user";

// dont need to set host for localhost
if (process.env.NODE_ENV === "production")
    axios.defaults.baseURL = DEPLOYED_URL;

// do not want axios to throw errors for any error codes, only want promise rejections for actual rejections 
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

        const currencyApiRes = await getApi(instance, `${PATH_CURRENCY}${userId}`,);

        const auctiondetailsApiRes = await getApi(instance, `${PATH_AUCTIONDETAILS}/${userId}`);

        const combineJson = {
            "currencyApi": currencyApiRes,
            "userApi": null, 
            "auctiondetailsApi": auctiondetailsApiRes
        }; 

		res.status(200).json(combineJson);
	} catch (err) {
        console.log(err);
        console.log("error caught");
		res.status(500).send(err.message);
	}
})

async function getApi(instance, url) {    
    console.log(`url to get from: ${url}`)
    const apiRes = await instance({
        url: `${url}`,
        method: "get",
    })
    .then(axiosRes => {
        // console.log(axiosRes)
        const json = {
            "data": axiosRes.data,
            "status": axiosRes.status,
            "message": `${axiosRes.status} ${axiosRes.statusText}`
        };
        return json;
    });
    return apiRes;
}

module.exports = router;