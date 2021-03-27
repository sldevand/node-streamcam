var startButton = document.getElementById('start');
var stopButton = document.getElementById('stop');
var container = document.getElementById('container');
var streamButtonsContainer = document.getElementById('stream-buttons-container');

initStreamButtonsEvents();

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
