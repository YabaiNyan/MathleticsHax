//require robotjs
var robot = require("robotjs");
//websocket
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    robot.typeString(message.toString());
    robot.keyTap("enter");
  });
});
