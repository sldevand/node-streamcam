const express = require('express')
const { exec } = require("child_process");
const app = express()
const port = 3000

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('StreamView')
})

app.get('/stream/start', (req, res) => {
    exec("sudo systemctl start streamcam ", (error, stdout, stderr) => {
        if (error) {
            res.send({ 'error': error.message });
            return;
        }
        if (stderr) {
            res.send({ 'error': stdout.message });
            return;
        }
        res.send({ 'success': 'Started' })
    });
})

app.get('/stream/stop', (req, res) => {
    exec("sudo systemctl stop streamcam ", (error, stdout, stderr) => {
        if (error) {
            res.send({ 'error': error.message });
            return;
        }
        if (stderr) {
            res.send({ 'error': stdout.message });
            return;
        }
        res.send({ 'success': 'Stopped' })
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

exec("ls -la", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
