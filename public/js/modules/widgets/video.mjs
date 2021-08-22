import Widget from './widget.mjs';

export default class Video extends Widget {
    constructor(querySelector, src) {
        super(querySelector);
        this.src = src;
        this.selector.onerror = () => {
            this.selector.src = 'assets/camera_off.svg';
            this.selector.style.maxWidth = '48px';
        }
    }

    refresh() {
        let timestamp = new Date().getTime();
        let queryString = '?t=' + timestamp;
        this.selector.src = '';
        this.selector.style.maxWidth = '100%';
        this.selector.src = this.src + queryString;
    }
}
