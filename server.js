//CONFIG
const config = require("config");
const serverConfig = config.get("Server");
const extraUrls = config.get("ExtraUrls");
const commandsConfig = config.get("Commands");

//UTILS
const utils = require("./helper/utils");

//SYSTEM
const path = require("path");
const cli = require("./services/cli.js");
const commands = require("./services/commands.js");
commands.init(cli, commandsConfig);

//NETWORK
const request = require("./services/request.js");
const favicon = require("serve-favicon");
const express = require("express");
const app = express();

//MIDDLEWARES
app.use(express.static("public"));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

//ROUTES
app.get("/stream/:action", async (req, res) => {
    commands.execStream(res, req.params.action);
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
    console.log(
        `Node-streamcam app listening at http://localhost:${serverConfig.port}`
    );
});
