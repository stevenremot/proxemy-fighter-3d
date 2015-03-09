export class Sights {
    
    constructor(domElement, pos, w, h) {
        this.domElement = domElement;
        this._w = w;
        this._h = h;
        this._position = pos;
        this.handleMove(0,0);
    }

    handleMove(dx, dy) {
        this._position[0] += dx;
        this._position[1] -= dy;
        this.domElement.style.left = `${this._position[0] - this._w}px`;
        this.domElement.style.top = `${this._position[1] - this._h}px`;
    }
}
