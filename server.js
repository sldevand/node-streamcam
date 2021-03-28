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

app.get('/ir/on', (req, res) => {
    exec("gpio mode 7 output && gpio write 7 1", (error, stdout, stderr) => {
        if (error) {
            res.send({ 'error': error.message });
            return;
        }
        if (stderr) {
            res.send({ 'error': stdout.message });
            return;
        }
        res.send({ 'success': 'Ir led on' })
    });
})
app.get('/ir/off', (req, res) => {
    exec("gpio mode 7 output && gpio write 7 0", (error, stdout, stderr) => {
        if (error) {
            res.send({ 'error': error.message });
            return;
        }
        if (stderr) {
            res.send({ 'error': stdout.message });
            return;
        }
        res.send({ 'success': 'Ir led off' })
    });
})


app.listen(port, () => {
    console.log(`Node-streamcam app listening at http://localhost:${port}`)
})
