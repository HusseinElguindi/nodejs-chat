var myArgs = process.argv.slice(2);
var port = parseInt(myArgs[0]);

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: port });

var clients = [];

wss.on('connection', function connection(ws) {

    clients.push(ws);
    console.log(clients.length);

    ws.on('message', function incoming(message) {
        var obj = JSON.parse(message);

        if (obj.type == "name_change") {

        }
        else if (obj.type == "message") {
            wss.broadcastMsg(message);
        }
        else if (obj.type == "command") {
            if (obj.data == "./connections") {

                let obj = {
                    type: "message",
                    usr: {
                        name: "Server",
                        id: -1,
                        color: "rgb(0, 0, 0)"
                    },
                    data: `There are ${clients.length} connections.`
                };

                ws.send(JSON.stringify(obj));
            }
        }
    });

    ws.on('close', function close(reasonCode, description) {
        clients.splice(clients.indexOf(ws), 1);
        // console.log(clients.length);

        let obj = {
            type: "message",
            usr: {
                name: "Server",
                id: -1,
                color: "rgb(0, 0, 0)"
            },
            data: "User left."
        };

        ws.send(JSON.stringify(obj));
    });

});

wss.broadcastMsg = function (msg) {
    console.log(msg);
    clients.forEach(function each(client) {
        client.send(msg);
     });
 };