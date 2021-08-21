import Widget from "./widget.mjs";

export default class Cpu extends Widget {
    constructor(querySelector, name) {
        super(querySelector);
        this.name = name;
        this.icon = '<img class="icon" src="assets/cpu.svg" alt="Cpu" />';
    }

    setData(data) {
        // Reformat text from stdout
        if (data.includes("temp=")) {
            var splitTemp = data.split("=")[1];
            data = splitTemp.substring(0, splitTemp.length - 2);
        }
        this.data = data;
        this.render();
    }

    render() {
        this.selector.innerHTML = `${this.icon} ${this.data} °C`;
    }
}
