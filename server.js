const config = require("config");
const serverConfig = config.get("Server");
const extraUrls = config.get("ExtraUrls");
const fetch = require("node-fetch");
const express = require("express");
var favicon = require("serve-favicon");
var path = require("path");
const { exec } = require("child_process");
const app = express();

app.use(express.static("public"));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.get("/stream/start", (req, res) => {
    execWithMessage(res, "sudo systemctl start streamcam", "Started");
});

app.get("/stream/stop", (req, res) => {
    execWithMessage(res, "sudo systemctl stop streamcam", "Stopped");
});

app.get("/ir/on", (req, res) => {
    execWithMessage(res, "gpio mode 7 output && gpio write 7 1", "Ir led on");
});

app.get("/ir/off", (req, res) => {
    execWithMessage(res, "gpio mode 7 output && gpio write 7 0", "Ir led off");
});

app.get("/measure/temp", (req, res) => {
    execWithMessage(res, "vcgencmd measure_temp");
});

app.get("/measure/extra/:type", (req, res) => {
    if (Object.keys(extraUrls).length === 0) {
        return res.send({
            error: "No extra measure urls found in configuration",
        });
    }

    let type = req.params.type;

    if ((foundUrl = findUrl(extraUrls, type))) {
        forwardJson(foundUrl, res);
        return;
    }

    return res.send({ error: "No  measure urls found" });
});

app.listen(serverConfig.port, () => {
    console.log(
        `Node-streamcam app listening at http://localhost:${serverConfig.port}`
    );
});

function execWithMessage(res, command, defaultSuccessMsg) {
    exec(command, (error, stdout, stderr) => {
        if (manageError(res, error, stdout, stderr)) {
            return;
        }
        let successMessage = "";
        if (!successMessage && stdout) {
            successMessage = stdout.trim();
        } else {
            successMessage = defaultSuccessMsg;
        }

        res.send({ success: successMessage });
    });
}

function manageError(res, error, stdout, stderr) {
    if (error) {
        res.send({ error: error.message });
        return true;
    }
    if (stderr) {
        res.send({ error: stdout.message });
        return true;
    }

    return false;
}

function findUrl(extraUrls, type) {
    if (extraUrls.hasOwnProperty(type)) {
        return extraUrls[type];
    }

    return null;
}

function fetchJson(endpoint) {
    return fetch(endpoint).then((response) => {
        return response.json();
    });
}

function forwardJson(endpoint, res) {
    return fetchJson(endpoint)
        .then((json) => {
            return res.send({ success: json });
        })
        .catch((err) => {
            return res.send({ error: err });
        });
}
