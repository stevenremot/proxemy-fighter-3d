export class Sights {
    
    constructor(domElement, pos, w, h) {
        this.domElement = domElement;
        this._w = w/2;
        this._h = h/2;
        this._position = pos;
        this.handleMove(0,0);
    }

    handleMove(dx, dy) {
        this._position[0] += dx;
        this._position[1] -= dy;
        this._stayInScreen();
        this.domElement.style.left = `${this._position[0]-this._w}px`;
        this.domElement.style.top = `${this._position[1]-this._h}px`;
    }

    _stayInScreen() {
        let x = this._position[0];
        let y = this._position[1];

        if (x < 0)
            x = 0;
        else if (x > window.innerWidth)
            x = window.innerWidth;
        
        if (y < 0)
            y = 0;
        else if (y > window.innerHeight)
            y = window.innerHeight;

        this._position = [x,y];
    }
}
