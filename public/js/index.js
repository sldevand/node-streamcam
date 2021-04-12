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
    var src = videoElement.src;
    var extraMeasuresContainer = document.getElementById("extra-measures-container");

    initAll();

    socket.on("connect", () => {
        console.log(socket.id);
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
        return fetchText("/stream/start").then((text) => {            
            refreshImage();
            showSnackBar(text);
        });
    }

    function stopStream() {
        return fetchText("/stream/stop").then((text) => {
            refreshImage();
            showSnackBar(text);
        });
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
        setTimeout(() => {
            var timestamp = new Date().getTime();
            var queryString = "?t=" + timestamp;

            videoElement.src = src + queryString;
        }, 500);
    }
})();
