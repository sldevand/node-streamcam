import Widget from './widget.mjs';
var evCache = new Array();
var prevDiff = -1;
export default class Video extends Widget {
    constructor(querySelector, src) {
        super(querySelector);
        this.src = src;
        this.selector.addEventListener('wheel', (event) => this.onZoom(event));
        this.scale = 1.0;
        this.initPinchZoomEvents();
    }

    refresh() {
        let timestamp = new Date().getTime();
        let queryString = '?t=' + timestamp;

        this.selector.src = this.src + queryString;
    }

    onLoadListener(callback) {
        this.selector.onLoad = () => callback();
    }

    initPinchZoomEvents() {
        this.selector.onpointerdown = (ev) => this.pointerdownHandler(ev);
        this.selector.onpointermove = (ev) => this.pointermoveHandler(ev);
        this.selector.onpointerup = (ev) => this.pointerupHandler(ev);
        this.selector.onpointerout = (ev) => this.pointerupHandler(ev);
    }

    pointerdownHandler(ev) {
        evCache.push(ev);
    }

    pointermoveHandler(ev) {
        for (var i = 0; i < evCache.length; i++) {
            if (ev.pointerId == evCache[i].pointerId) {
                evCache[i] = ev;
                break;
            }
        }

        if (evCache.length == 2) {
            var curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);
            if (prevDiff > 0) {
                let factor = 0.1 * (curDiff - prevDiff);
                this.setScale(this.getScale() + factor);
            }

            prevDiff = curDiff;
        }
    }

    pointerupHandler(ev) {
        this.removeEvent(ev);
        if (evCache.length < 2) {
            prevDiff = -1;
        }
    }

    removeEvent(ev) {
        for (var i = 0; i < evCache.length; i++) {
            if (evCache[i].pointerId == ev.pointerId) {
                evCache.splice(i, 1);
                break;
            }
        }
    }

    onZoom(event) {
        event.preventDefault();
        let factor = 1 - 0.001 * event.deltaY;
        this.setScale(this.getScale() * factor);
    }

    setScale(scale) {
        this.scale = scale;
        if (this.scale < 1) {
            this.scale = 1;
        } else if (this.scale > 3) {
            this.scale = 4;
        }

        this.selector.style.transform = `scale(${this.scale})`;
    }

    getScale() {
        return this.scale;
    }
}