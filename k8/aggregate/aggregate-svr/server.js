const axios = require("axios");
const express = require("express");
const app = express();

// note that you need the http:// part if youre not using localhost, for axios requests
const hostUrl = "http://google.com"// "kubernetes.docker.internal"; 
const endpoint1 = "/api/auctiondetails";
const endpoint2 = "/api/currency";
const endpoint3 = "/api/user";
app.use(express.json());

axios.defaults.baseURL = hostUrl;

app.get("/agg/userdetails/:userId", async (req, res) => {
    try {
        console.log(`received req:\n${JSON.stringify(req.url)}`);
        console.log(`received req headers:\n${JSON.stringify(req.headers)}`);
        
        const jsonResponseFromTestApi = await axios({
            // baseUrl: hostUrl, // "kubernetes.docker.internal", //"localhost",
            url: `/api/categories`,
            // url: "/test-auth",
			method: "get",
		})
        .catch(axiosRes => {
            // bug: there might be other errors than just a not 200 ok status code
            // e.g. cant connect to host
            // so need to handle them differently...
            if (!axiosRes.response) { throw axiosRes; }

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

// app.get("/agg/auth", async (req, res) => {
//     try {
//         const url = "localhost/test-auth";
//         const data = await fetch(url)
//             .then(response => response.json())

//         res.send(data);
//     } catch (ex) {
//         res.status(500).send(ex.message)
//     }
// })

app.all("/api/", async (req, res) => {
    await axios({
            url: `/api/categories`,
            url: "/test-auth",
			method: "get",
    })
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err.message))
})

// https://stackoverflow.com/questions/49967779/axios-handling-errors
function axiosSpecificError(error, res) {
    if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        res.status(error.response.status).send()

    } else if (error.request) {        
        // The request was made but no response was received
        console.log(error.request);

    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
    
}


const port = process.env.PORT || 8085; 

const server = app.listen(port, () => {
    console.log(`listening on port ${port}...`);
}); 

// Export our app for testing purposes
module.exports = server;