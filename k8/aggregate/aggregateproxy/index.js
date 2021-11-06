const axiosCombiner = require('./axios');
const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// Create Express Server
const app = express();

// Configuration
const PORT = process.env.PORT || 8085;
const HOST = "0.0.0.0";

// Configuring api gateway location for the proxy middleware
const LOCAL_URL = "http://localhost"; // need http://
const DEPLOYED_URL = process.env.API_GATEWAY_URL; // need http://
const FORWARDING_URL = (process.env.NODE_ENV === "production" && process.env.API_GATEWAY_URL) 
    ? DEPLOYED_URL 
    : LOCAL_URL 

console.log(`FORWARDING_URL: ${FORWARDING_URL}`);

// Logging
app.use(morgan('dev'));

// To see if this proxy is running
app.get('/agg/test', (req, res) => {
    res.send('This is an aggregation and proxy endpoint. It seems to be up and running.');
});

// Aggregate endpoints
app.use('/agg/userdetails', axiosCombiner);
 
// Proxy endpoints
// https://www.twilio.com/blog/node-js-proxy-server
app.use('/api', createProxyMiddleware({
    target: FORWARDING_URL,
    changeOrigin: true,
}));

 // Start the Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
 