import Widget from "./widget.mjs";

export default class Snackbar extends Widget{
    show(text) {
        this.selector.className = "show";
        this.selector.innerHTML = text;
        setTimeout(() => {
            this.selector.className = this.selector.className.replace("show", "");
        }, 3000);
    }
}