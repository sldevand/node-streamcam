import Widget from './widget.mjs';

export default class Video extends Widget {
    constructor(querySelector, src) {
        super(querySelector);
        this.src = src;
        this.selector.addEventListener('gesturechange', this.onZoom);


        this.selector.addEventListener('wheel', this.onZoom);
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
        ev.preventDefault();
        let isPinch = ev.deltaY < 50;
        let scale = 1.0;
        if (isPinch) {
            // This is a pinch on a trackpad
            let factor = 1 - 0.01 * ev.deltaY;
            scale *= factor;
            this.selector.style.transform = `scale(${scale})`;
        } else {
            // This is a mouse wheel
            let strength = 1.4;
            let factor = ev.deltaY < 0 ? strength : 1.0 / strength;
            scale *= factor;
            this.selector.style.transform = `scale(${scale})`;
        }
    }
}