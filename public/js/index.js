var startButton = document.getElementById('start');
var stopButton = document.getElementById('stop');
var container = document.getElementById('container');
var streamButtonsContainer = document.getElementById('stream-buttons-container');
var onButton = document.getElementById('on');
var offButton = document.getElementById('off');
var irButtonsContainer = document.getElementById('ir-buttons-container');

initStreamButtonsEvents();
initIrButtonsEvents();

function initStreamButtonsEvents() {
    container.addEventListener('click', streamButtonsContainerDisplayToggle);
    startButton.addEventListener('click', startStream);
    stopButton.addEventListener('click', stopStream);
}

function startStream() {
    fetch('/stream/start')
        .then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log(json);
        });
}


function stopStream() {
    fetch('/stream/stop')
    .then(function (response) {
        return response.json();
    }).then(function (json) {
        console.log(json);
    });
}

function streamButtonsContainerDisplayToggle() {
    var display;
    if (!streamButtonsContainer.style.display
        || streamButtonsContainer.style.display === 'none'
    ) {
        display = 'block';
    } else {
        display = 'none';
    }

    streamButtonsContainer.style.display = display;
}

function initIrButtonsEvents() {
    container.addEventListener('click', irButtonsContainerDisplayToggle);
    onButton.addEventListener('click', irOn);
    offButton.addEventListener('click', irOff);
}



function irOn() {
    fetch('/ir/on')
        .then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log(json);
        });
}


function irOff() {
    fetch('/ir/off')
    .then(function (response) {
        return response.json();
    }).then(function (json) {
        console.log(json);
    });
}

function irButtonsContainerDisplayToggle() {
    var display;
    if (!irButtonsContainer.style.display
        || irButtonsContainer.style.display === 'none'
    ) {
        display = 'block';
    } else {
        display = 'none';
    }

    irButtonsContainer.style.display = display;
}
