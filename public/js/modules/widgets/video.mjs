import Widget from './widget.mjs';

export default class Video extends Widget{
    constructor(querySelector, src) {
        super(querySelector);
        this.src = src;
    }

    refresh() {
        let timestamp = new Date().getTime();
        let queryString = '?t=' + timestamp;
    
        this.selector.src = this.src + queryString;
    }

    onLoadListener(callback) {
        this.selector.onLoad = () => callback();
    }
}