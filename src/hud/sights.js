export class Sights {

    constructor(domElement, window, pos, w, h) {
        this.domElement = domElement;
        this._w = w;
        this._h = h;
        this._window = window;
        let clientRect = domElement.getBoundingClientRect();
        this._halfWidth = null;
        this._halfHeight = null;
        this._position = [
            clientRect.left,
            clientRect.top
        ];
    }

    handleMove(dx, dy, camera) {
        if (this._halfWidth === null && this._halfHeight === null) {
            let clientRect = this.domElement.getBoundingClientRect();
            this._halfWidth = clientRect.width / 2;
            this._halfHeight = clientRect.height / 2;
            console.log(this._halfWidth, this._halfHeight);
        }

        this._position[0] =  Math.min(
            Math.max(this._position[0] + dx + this._halfWidth, 0),
            this._window.innerWidth
        ) - this._halfWidth;

        this._position[1] = Math.min(
            Math.max(this._position[1] - dy + this._halfHeight, 0),
            this._window.innerHeight
        ) - this._halfHeight;

        this.domElement.style.left = `${this._position[0]}px`;
        this.domElement.style.top = `${this._position[1]}px`;

        // update camera's x_relative and y_relative
        camera.x_relative = (this._position[0] + this._halfWidth) / this._window.innerWidth;
        camera.x_relative += (2*camera.x_relative-1) * this._halfWidth / this._window.innerWidth;
        
        camera.y_relative = this._position[1] / this._window.innerHeight;
        camera.y_relative += (2*camera.y_relative-1) * this._halfHeight / this._window.innerHeight;
    }
}
