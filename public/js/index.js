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

    initAll();

    function initAll() {
        initVideoClickEvent();
        initStreamButtonsEvents();
        initIrButtonsEvents();
        measureCpuTemp();
        setInterval(measureCpuTemp, 5000);
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
        return fetchText("/stream/start").then((textStart) => {
            return fetchText("/ir/on").then((textOn) => {
                showSnackBar(textStart + " and <br>" + textOn);
            });
        });
    }

    function stopStream() {
        return fetchText("/stream/stop").then((textStop) => {
            return fetchText("/ir/off").then((textOff) => {
                showSnackBar(textStop + " and <br>" + textOff);
            });
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

            cpuTemp.innerText = text + " °C";
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
})();
