export default class Widget {
    constructor(querySelector) {
        this.selector = document.querySelector(querySelector);
    }

    show() {
        this.selector.style.display = 'block';
    }

    hide() {
        this.selector.style.display = 'none';
    }

    render() {
        throw new Error('You have to implement the render() method!');
    }

    getSelector() {
        return this.selector;
    }
}
