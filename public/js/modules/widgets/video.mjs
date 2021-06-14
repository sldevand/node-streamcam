import Widget from './widget.mjs';

export default class Video extends Widget {
    constructor(querySelector, src) {
        super(querySelector);
        this.src = src;
        this.selector.addEventListener('wheel', (event) => this.onZoom(event));
        this.scale = 1.0;
        this.resetPosition();
        this.initPinchZoomEvents();
        this.evCache = new Array();
        this.prevDiff = -1;
    }

    refresh() {
        let timestamp = new Date().getTime();
        let queryString = '?t=' + timestamp;

        this.selector.src = this.src + queryString;
    }

    resetPosition() {
        this.position = { x: 0.0, y: 0.0 }
        this.prevPosition = this.position;
        this.updateTransform();
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
        this.evCache.push(ev);
    }

    pointermoveHandler(ev) {
        for (var i = 0; i < this.evCache.length; i++) {
            if (ev.pointerId == this.evCache[i].pointerId) {
                this.evCache[i] = ev;
                if (this.evCache.length === 1 && this.getScale() > 1) {
                    this.move(ev);
                }
                break;
            }
        }

        if (this.evCache.length === 2) {
            var curDiff = Math.abs(this.evCache[0].clientX - this.evCache[1].clientX);
            if (this.prevDiff > 0) {
                let factor = 0.03 * (curDiff - this.prevDiff);
                this.setScale(this.getScale() + factor);
            }

            this.prevDiff = curDiff;
        }
    }

    pointerupHandler(ev) {
        this.removeEvent(ev);
        if (this.evCache.length < 2) {
            this.prevDiff = -1;
        }
        this.prevPosition = this.position;
    }

    removeEvent(ev) {
        for (var i = 0; i < this.evCache.length; i++) {
            if (this.evCache[i].pointerId == ev.pointerId) {
                this.evCache.splice(i, 1);
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
            this.resetPosition();
        } else if (this.scale > 4) {
            this.scale = 4;
        }

        this.updateTransform();
    }

    move(ev) {
        let diffX = (ev.clientX - this.selector.clientWidth / 2) - this.prevPosition.x;
        let diffY = (ev.clientY - this.selector.clientHeight / 2) - this.prevPosition.y;
        this.position.x += diffX;
        this.position.y += diffY;

        this.updateTransform();
    }

    updateTransform() {
        this.selector.style.transform = `scale(${this.scale}) translate(${this.position.x}px, ${this.position.y}px)`;
    }

    getScale() {
        return this.scale;
    }
}
