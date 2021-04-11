//CONFIG
const config = require("config");
const serverConfig = config.get("Server");
const extraUrls = config.get("ExtraUrls");
const commands = config.get("Commands");

//SYSTEM
const path = require("path");
const command = require("./services/command.js");

//NETWORK
const request = require("./services/request.js");
const favicon = require("serve-favicon");
const express = require("express");
const app = express();

//MIDDLEWARES
app.use(express.static("public"));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

//ROUTES
app.get("/stream/start", async (req, res) => {
    try {
        let successMessage  = await command.execCommand(commands.stream.start, "Stream started");
        let successMessage2 = await command.execCommand(commands.ir.on, "Ir led on");
        if (successMessage2) {
            successMessage += " and " + successMessage2;
        }

        res.send({ success: successMessage });
    } catch (exception) {
        res.send({ error: exception.message });
    }
});

app.get("/stream/stop", async (req, res) => {
    try {
        let successMessage  = await command.execCommand(commands.stream.stop,"Stream stopped");
        let successMessage2 = await command.execCommand(commands.ir.off, "Ir led off");
        successMessage += " and " + successMessage2;

        res.send({ success: successMessage });
    } catch (exception) {
        res.send({ error: exception.message });
    }
});

app.get("/ir/on", (req, res) => {
    command.execWithMessage(res, commands.ir.on, "Ir led on");
});

app.get("/ir/off", (req, res) => {
    command.execWithMessage(res, commands.ir.off, "Ir led off");
});

app.get("/measure/temp", (req, res) => {
    command.execWithMessage(res, commands.measure.cpu_temp);
});

app.get("/measure/extra/:type", (req, res) => {
    if (Object.keys(extraUrls).length === 0) {
        return res.send({
            error: "No extra measure urls found in configuration",
        });
    }

    let type = req.params.type;

    if ((foundUrl = findUrl(extraUrls, type))) {
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

// MISC FUNCTIONS


function findUrl(extraUrls, type) {
    if (extraUrls.hasOwnProperty(type)) {
        return extraUrls[type];
    }

    return null;
}
