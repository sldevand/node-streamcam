import Widget from './widget.mjs';

export default class Snackbar extends Widget{
    constructor(querySelector) {
        super(querySelector);
        this.text = '';
    }

    show(text) {
        this.selector.className = 'show';
        this.setText(text);       
        setTimeout(() => {
            this.hide()
        }, 3000);
    }

    hide() {
        this.selector.className = this.selector.className.replace('show', '');
        this.text = '';
    }

    setText(text) {
        this.text = text;
        this.render();
    }

    render() {
        this.selector.innerHTML = this.text;
    }
}