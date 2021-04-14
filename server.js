//CONFIG
const config = require("config");
const serverConfig = config.get("Server");
const socketioConfig = config.get("Socketio");
const extraUrls = config.get("ExtraUrls");
const commandsConfig = config.get("Commands");
const irRestrictConfig = config.get("IrRestrict");
const streamConfig = config.get("Stream");

//UTILS
const utils = require("./helper/utils");

//SYSTEM
const path = require("path");
const cli = require("./services/cli.js");
const commands = require("./services/commands.js");
commands.init(cli, commandsConfig, irRestrictConfig);

//NETWORK
const request = require("./services/request.js");
const favicon = require("serve-favicon");
const express = require("express");
const app = express();
const http = require("http");

//SOCKETIO
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

//SOCKETIO
var allClients = [];
var timeout;
io.sockets.on("connection", async (socket) => {
    allClients.push(socket);
    if (allClients.length === 1 && !timeout) {
        let result = await commands.execStream("start");
        console.log(result);
        emitTimedEvent("streamStart", result, streamConfig.startTimeout);
    }

    flushTimeout();

    socket.on("disconnect", async () => {
        var i = allClients.indexOf(socket);
        allClients.splice(i, 1);
        if (allClients.length !== 0) {
            return;
        }
        flushTimeout();
        timeout = setTimeout(async () => {
            let result = await commands.execStream("stop");
            console.log(result);
            emitTimedEvent("streamStop", result, streamConfig.stopTimeout);
            flushTimeout();
        }, streamConfig.stopTimeout);
    });
});

function flushTimeout()
{
    if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
    }
}

//MIDDLEWARES
app.use(express.static("public"));
app.use(express.static("node_modules/socket.io/client-dist"));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

//ROUTES
app.get("/stream/:action", async (req, res) => {
    const action = req.params.action;
    const result = await commands.execStream(action);

    if (result.hasOwnProperty('success')) {
        emitTimedEvent("stream" + utils.capitalizeFirstLetter(action), result, streamConfig.startTimeout);
    } else {
        socket.emit('error', result);
    }

    res.send(result);
});

app.get("/ir/:action", (req, res) => {
    commands.execIrWithMessage(res, req.params.action);
});

app.get("/measure/temp", (req, res) => {
    commands.execCpuTemp(res);
});

app.get("/measure/extra/:type", (req, res) => {
    if (Object.keys(extraUrls).length === 0) {
        return res.send({
            error: "No extra measure urls found in configuration",
        });
    }

    let type = req.params.type;

    if ((foundUrl = utils.findUrl(extraUrls, type))) {
        request.forwardJson(foundUrl, res);
        return;
    }

    return res.send({ error: "No  measure urls found" });
});

// LISTEN
app.listen(serverConfig.port, () => {
    console.log(`Node-streamcam app listening on port ${serverConfig.port}`);
});

server.listen(socketioConfig.port, () => {
    console.log(`socketio listening listening on port ${socketioConfig.port}`);
});

function emitTimedEvent(event, data, timeout) {
    setTimeout(() => {
        io.sockets.emit(event, data);
    }, timeout);
}
