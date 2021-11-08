/** Calls individual apis related to user (currency, auctiondetails) and combining their responses into one. */
const combinerForUserDetails = require('./combinerForUserDetails');
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
// const LOCAL_URL = "http://localhost"; // need http://
const LOCAL_URL = "http://34.126.147.222";
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
app.use('/agg/userdetails', combinerForUserDetails);
 


//// WEBSOCKET RELATED



// Proxy polling
// app.use(`/socket.io`, function ( req, res ) {
// 	proxy.web( req, res, { target: `${FORWARDING_URL}` } );
// });

// Proxy socket
// const SOCKET_PATH = '/socket.io';
// app.use(`/${SOCKET_PATH}`, function ( req, res ) {
// 	proxy.web( req, res, { target: `http://${FORWARDING_URL}/${SOCKET_PATH}` } );
// });

//old
//** 
// app.use('/socket.io', createProxyMiddleware({
//     target: FORWARDING_URL,
//     changeOrigin: true,
//     ws: true
// }));

app.use('/auctionroom', createProxyMiddleware({
    target: `${FORWARDING_URL}/auctionroom`,
    changeOrigin: true,
    // ws: true
}));


/**
 * Configure proxy middleware
 */
const wsProxy = createProxyMiddleware('/socket.io', {
    target: `${FORWARDING_URL}/socket.io`,
    changeOrigin: true, // for vhosted sites, changes host header to match to target's host
    ws: true, // enable websocket proxy
    logLevel: 'debug',
  });
  
app.use(wsProxy);


// app.on('upgrade', function (req, socket, head) {
//     console.log("proxying upgrade request", req.url);
//     proxy.ws(req, socket, head);
//   });

// Proxy upgrade
// proxyServer.on('upgrade', function (req, socket, head) {
//     console.log("proxying upgrade request", req.url);
//     proxy.ws(req, socket, head);
// });

// proxyServer.listen( PORT, function (  ) {
// 	console.log( `Proxy server listening on http://${HOST}:${PORT}`, '\n' );
// });


//// OTHER ENDPOINTS

/**  
 * Forward exactly as received. There's no processing or additional setup needed. 
 * This http-proxy-middleware also helps forward the headers as received.
 * https://www.twilio.com/blog/node-js-proxy-server
*/
app.use('/api', createProxyMiddleware({
    target: FORWARDING_URL,
    changeOrigin: true,
}));



//// Start this aggregating, proxying node.js server
const server = app.listen(PORT, HOST, () => {
    console.log(`Starting nodejs server at ${HOST}:${PORT}`);
});
 
server.on('upgrade', wsProxy.upgrade);

