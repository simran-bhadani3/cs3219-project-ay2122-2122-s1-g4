const axiosCombiner = require('./axios');
const express = require('express');
const morgan = require("morgan");
const http = require('http');
const httpProxy = require('http-proxy')
const { createProxyMiddleware } = require('http-proxy-middleware');

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// Create Express Server
/** App refers to express app, that will be handling client's requests and sending it out to the next service/ */
const app = express();
// const server = require('http').createServer(app)

//enable cors
const cors = require('cors');
app.use(cors())

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


//// ENDPOINTS INVOLVING AGGREGATION FROM MULTIPLE APIS 
app.use('/agg/userdetails', axiosCombiner);
 


//// WEBSOCKET RELATED

// todo should be renamed to chatRoomProxy or something after integrating the example 
const proxy = httpProxy.createProxyServer({
	target : `http://${FORWARDING_URL}`, // the target is to the backend, not the frontend (im guessing its the socket.io path in the apigateway)
	// target : `http://${HOST}:${API_PORT}`, // todo help, this is the example target given. i'm not sure if its correct
    // ws     : true,
});
const proxyServer = http.createServer(app);

// Proxy websockets
proxyServer.on('upgrade', function (req, socket, head) {
    console.log("proxying upgrade request", req.url);
    proxy.ws(req, socket, head);
});

// Proxy websockets
// https://www.twilio.com/blog/node-js-proxy-server
const SOCKET_PATH = '/socket.io';
app.use(`/${SOCKET_PATH}`, function ( req, res ) {
	proxy.web( req, res, { target: `http://${FORWARDING_URL}/${SOCKET_PATH}` } );
});

// Proxy socket io
// https://www.twilio.com/blog/node-js-proxy-server
app.use('/auctionroom', createProxyMiddleware({
    target: FORWARDING_URL,
    changeOrigin: true,
    ws: true
}));



//// OTHER ENDPOINTS

// Forward exactly as received 
// https://www.twilio.com/blog/node-js-proxy-server
app.use('/api', createProxyMiddleware({
    target: FORWARDING_URL,
    changeOrigin: true,
    ws: true // todo should the ws be for these requests too or accidently added?
}));



//// Start this aggregating, proxying node.js server
app.listen(PORT, HOST, () => {
    console.log(`Starting nodejs server at ${HOST}:${PORT}`);
});
 

