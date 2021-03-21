'use strict';

const WebSocketServer = require('websocket').server;
const http = require('http');

let wsServer;

function setupWsServer() {
    if (wsServer) {
        throw new Error('Already constructed wsServer');
    }
    const server = http.createServer();
    server.listen(process.env.PORT_WS, function() { });
    wsServer = new WebSocketServer({ httpServer: server });

    // WebSocket server
    wsServer.on('request', function(request) {
        var connection = request.accept(null, request.origin);

        // This is the most important callback for us, we'll handle
        // all messages from users here.
        connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('ws string msg: ', message.utf8Data);
            let object;
            try {
            object = JSON.parse(message.utf8Data);
            } catch (e) {
            console.error(e);
            }
            console.log('ws json msg: ', object);
        }
        });

        // connection.on('close', function(connection) {
        //   // close user connection
        // });
    });
    return wsServer;
}

/**
 * @param {object} payload 
 */
function broadcastObj(payload) {
    wsServer.broadcast(JSON.stringify(payload));
}

module.exports = {
    broadcastObj: broadcastObj,
    setupWsServer: setupWsServer,
};
