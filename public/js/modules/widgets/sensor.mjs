import Widget from './widget.mjs';

export default class Sensor extends Widget {
    constructor(querySelector, name) {
        super(querySelector);
        this.name = name;
        this.icon = '<img class="icon" src="assets/thermometer.svg" alt="thermometer" />';
    }

    setData(data) {
        if (Array.isArray(data) && data.length > 0) {
            data = data[0];
        }

        if (data.hasOwnProperty('actif') && data.actif == 0){
            data.valeur1 = undefined;
            data.valeur2 = undefined;
        }

        this.data = data;
        this.render();
    }

    render() {
        let additionalValue = this.data.valeur2 ? `| ${this.data.valeur2 || '--'} %` : '';
        this.selector.innerHTML = `<span>${this.icon} ${this.data.valeur1 || '--'} °C ${additionalValue}</span>`;
    }
}
