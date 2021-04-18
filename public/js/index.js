import Snackbar from './modules/widgets/snackbar.mjs';
import Widget from './modules/widgets/widget.mjs';
import Sensor from './modules/widgets/sensor.mjs';
import Cpu from './modules/widgets/cpu.mjs';
import Network from './modules/services/network.mjs';

var snackbar = new Snackbar('#snackbar');
var loader = new Widget('.loading');
var sensors = {
    confortmetre : new Sensor('#extra-measures-container', 'confortmetre')
};
var cpu = new Cpu('#cpu-temp');
var network = new Network();

var startButton = document.getElementById('start');
var stopButton = document.getElementById('stop');
var container = document.getElementById('container');
var displayContainers = document.getElementsByClassName('display-container');
var onButton = document.getElementById('on');
var offButton = document.getElementById('off');

var videoElement = document.getElementById('videoElement');
var src = config.stream.baseUrl + ':' + config.stream.port + '?action=stream';


initAll();

var socket = io(`${config.socketio.baseUrl}:${config.socketio.port}`, {
    autoConnect: false,
});
socket.connect();
socket
    .on('streamStart', (data) => {
        handleStreamAction(data);
    })
    .on('streamStop', (data) => {
        handleStreamAction(data);
    })
    .on('disconnect', () => {
        loader.hide();
    })
    .on('connect', () => {
        loader.hide();
    });

window.addEventListener('blur', () => {
    socket.disconnect();
});

window.addEventListener('focus', () => {
    socket.connect();
});

videoElement.onload = () => {
    loader.hide();
};

function initAll() {
    initVideoClickEvent();
    initStreamButtonsEvents();
    initIrButtonsEvents();
    measureCpuTemp();
    setInterval(measureCpuTemp, 5000);
    let extraMeasureType = 'confortmetre';
    measureExtra(extraMeasureType);
    setInterval(() => measureExtra(extraMeasureType), 120000);
    refreshImage();
}

function initVideoClickEvent() {
    container.addEventListener('click', () => {
        Array.prototype.forEach.call(displayContainers, displayContainerToggle);
    });
}

function initStreamButtonsEvents() {
    startButton.addEventListener('click', startStream);
    stopButton.addEventListener('click', stopStream);
}

function initIrButtonsEvents() {
    onButton.addEventListener('click', irOn);
    offButton.addEventListener('click', irOff);
}

function startStream() {
    loader.show();
    return fetch('/stream/start');
}

function stopStream() {
    loader.show();
    return fetch('/stream/stop');
}

function irOn() {
    return fetchWithMessage('/ir/on');
}

function irOff() {
    return fetchWithMessage('/ir/off');
}

function measureCpuTemp() {
    network.fetchText('/measure/temp', '--').then((text) => {
        cpu.setData(text);
    });
}

function measureExtra(endpoint) {
    network.fetchJson(`/measure/extra/${endpoint}`, '--').then((json) => {
        if (json.error) {
            snackbar.show(json.error);
            return;
        }

        sensors[endpoint].setData(json.success);
    });
}

function displayContainerToggle(container) {
    let display;
    if (!container.style.display || container.style.display === 'none') {
        display = 'block';
    } else {
        display = 'none';
    }

    container.style.display = display;
}

function fetchWithMessage(endpoint) {
    return network.fetchText(endpoint).then((text) => {
        snackbar.show(text);
    });
}

function refreshImage() {
    let timestamp = new Date().getTime();
    let queryString = '?t=' + timestamp;

    videoElement.src = src + queryString;
}

function handleStreamAction(data) {
    refreshImage();
    const text = data.hasOwnProperty('success') ? data.success : data.error;
    loader.hide();
    snackbar.show(text);
}
