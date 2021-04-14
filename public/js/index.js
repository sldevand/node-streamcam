(function () {
    var startButton = document.getElementById("start");
    var stopButton = document.getElementById("stop");
    var container = document.getElementById("container");
    var displayContainers = document.getElementsByClassName(
        "display-container"
    );
    var onButton = document.getElementById("on");
    var offButton = document.getElementById("off");
    var snackbar = document.getElementById("snackbar");
    var cpuTemp = document.getElementById("cpu-temp");
    var videoElement = document.getElementById("videoElement");
    var src = config.stream.baseUrl + ':' + config.stream.port + '?action=stream';
    var extraMeasuresContainer = document.getElementById("extra-measures-container");

    initAll();

    var socket = io(`${config.socketio.baseUrl}:${config.socketio.port}`);
    socket.on("streamStart", (data) => {
        refreshImage();
        const text = data.hasOwnProperty('success') ? data.success : data.error;
        showSnackBar(data.success);
    });
    socket.on("streamStop", (data) => {
        refreshImage();
        const text = data.hasOwnProperty('success') ? data.success : data.error;
        showSnackBar(data.success);
    });

    socket.on("disconnect", () => {
        showSnackBar('Disconnected from socketio server');
    });

    socket.on("connect", () => {
        showSnackBar('Connected to socketio server');
    });

    window.addEventListener('blur', () => {
        socket.disconnect();
    });
    
    window.addEventListener('focus', () => {
        socket.connect();
    });

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
        container.addEventListener("click", () => {
            Array.prototype.forEach.call(
                displayContainers,
                displayContainerToggle
            );
        });
    }

    function initStreamButtonsEvents() {
        startButton.addEventListener("click", startStream);
        stopButton.addEventListener("click", stopStream);
    }

    function initIrButtonsEvents() {
        onButton.addEventListener("click", irOn);
        offButton.addEventListener("click", irOff);
    }

    function startStream() {
        return fetch("/stream/start");
    }

    function stopStream() {
        return fetch("/stream/stop");
    }

    function irOn() {
        return fetchWithMessage("/ir/on");
    }

    function irOff() {
        return fetchWithMessage("/ir/off");
    }

    function measureCpuTemp() {
        fetchText("/measure/temp", "--").then(function (text) {
            // Reformat text from stdout
            if (text.includes('temp=')) {
                var splitTemp = text.split('=')[1];
                text = splitTemp.substring(0, splitTemp.length - 2);
            }
            cpuTemp.innerText = 'Cpu=' + text + ' °C';
        });
    }

    function measureExtra(endpoint) {
        fetchJson(`/measure/extra/${endpoint}`, "--").then(function (json) {
            if (json.error) {
                extraMeasuresContainer.innerHTML = `<span>${endpoint} = -- °C | -- %</span>`;
                return;
            }

            let sensor = json.success;
            if (Array.isArray(sensor) && sensor.length > 0) {
                sensor = sensor[0];
            }
            extraMeasuresContainer.innerHTML = `<span>${endpoint} = ${sensor.valeur1 || '--'} °C | ${sensor.valeur2 || '--'} %</span>`;
        });
    }

    function displayContainerToggle(container) {
        var display;
        if (!container.style.display || container.style.display === "none") {
            display = "block";
        } else {
            display = "none";
        }

        container.style.display = display;
    }

    function fetchJson(endpoint) {
        return fetch(endpoint).then(function (response) {
            return response.json();
        });
    }

    function fetchText(endpoint, errorMessage) {
        return fetchJson(endpoint).then(function (json) {
            if (errorMessage) {
                json.error = errorMessage;
            }
            return json.success ? json.success : json.error;
        });
    }

    function fetchWithMessage(endpoint) {
        return fetchText(endpoint).then(function (text) {
            showSnackBar(text);
        });
    }

    function showSnackBar(text) {
        snackbar.className = "show";
        snackbar.innerHTML = text;
        setTimeout(function () {
            snackbar.className = snackbar.className.replace("show", "");
        }, 3000);
    }

    function refreshImage() {
        var timestamp = new Date().getTime();
        var queryString = "?t=" + timestamp;

        videoElement.src = src + queryString;
    }
})();
