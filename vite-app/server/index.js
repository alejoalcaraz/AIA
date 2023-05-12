const WebSocket = require("ws");

const wss = new WebSocket('wss://aiadeploy.onrender.com');

wss.on("connection", ws=>{

    console.log("New client connected");

    ws.on("close", () => {
        console.log("Client has disconnected");
    });
});