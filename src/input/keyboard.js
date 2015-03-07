/**
 * @description
 * Execute all callbacks, passing them args as arguments.
 */
function execCallbacks(callbacks, ...args) {
    for (let callback of callbacks) {
        callback(...args);
    }
}

const KEY_DIRECTIONS = {
    Left: [-1, 0],
    Right: [1, 0],
    Up: [0, 1],
    Down: [0, -1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, 1],
    ArrowDown: [0, -1]
};

/**
 * @description
 * Keyboard input source
 */
export class KeyboardInput {
    constructor(document) {
        this._callbacks = {
            onDirectionChanged: []
        };

        this._downKeys = {
            Left: false,
            Right: false,
            Up: false,
            Down: false,
            ArrowLeft: false,
            ArrowRight: false,
            ArrowUp: false,
            ArrowDown: false
        };

        /**
         * @description
         * Current input direction.
         */
        this.currentDirection = [0, 0];

        document.addEventListener('keydown', (evt) => this._handleKeyDown(evt));
        document.addEventListener('keyup', (evt) => this._handleKeyUp(evt));
    }

    /**
     * @description
     * Register a callback to call when the 2D movement is changing.
     *
     * The callback takes dx and dy as arguments, wih values between
     * -1 and 1.
     *
     * @param {Function} callback
     *
     * @returns this
     */
    onDirectionChanged(callback) {
        this._callbacks.onDirectionChanged.push(callback);
        return this;
    }

    _handleKeyDown(event) {
        let identifier = event.key || event.keyIdentifier;

        if (identifier in this._downKeys) {
            this._downKeys[identifier] = true;
            this._recomputeDirection();
            event.preventDefault();
        }
    }

    _handleKeyUp(event) {
        let identifier = event.key || event.keyIdentifier;

        if (identifier in this._downKeys) {
            this._downKeys[identifier] = false;
            this._recomputeDirection();
            event.preventDefault();
        }
    }

    _recomputeDirection() {
        let x = 0, y = 0;

        for (let key in this._downKeys) {
            if (this._downKeys[key]) {
                let [dx, dy] = KEY_DIRECTIONS[key];
                x += dx;
                y += dy;
            }
        }

        if (x !== this.currentDirection[0] || y != this.currentDirection[1]) {
            this.currentDirection[0] = x;
            this.currentDirection[1] = y;
            execCallbacks(this._callbacks.onDirectionChanged, x, y);
        }
    }
}
