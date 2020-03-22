var myArgs = process.argv.slice(2);
var port = parseInt(myArgs[0]);

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: port });

wss.on('connection', function connection(ws) {
    console.log("Connected");

    ws.on('message', function incoming(message) {
        ws.send(message);
    });

    // ws.send('something');
});