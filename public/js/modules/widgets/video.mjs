import Widget from './widget.mjs';

export default class Video extends Widget {
    constructor(querySelector, src) {
        super(querySelector);
        this.src = src;
        this.selector.addEventListener('gesturechange',(event) => this.onZoom(event));


        this.selector.addEventListener('wheel', (event) => this.onZoom(event));
        this.scale=1.0;
    }

    refresh() {
        let timestamp = new Date().getTime();
        let queryString = '?t=' + timestamp;

        this.selector.src = this.src + queryString;
    }

    onLoadListener(callback) {
        this.selector.onLoad = () => callback();
    }

    onZoom(event) {
        event.preventDefault();
        let isPinch = event.deltaY < 50;
        
        if (isPinch) {
            // This is a pinch on a trackpad
            let factor = 1 - 0.01 * event.deltaY;
            this.scale *= factor;
            this.selector.style.transform = `scale(${this.scale})`;
        } else {
            // This is a mouse wheel
            let strength = 1.1;
            let factor = event.deltaY < 0 ? strength : 1.0 / strength;
            this.scale *= factor;
            this.selector.style.transform = `scale(${this.scale})`;
        }
    }
}