import Widget from "./widget.mjs";

export default class Cpu extends Widget {
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
        this.selector.innerText = `Cpu = ${this.data} °C`;
    }
}
