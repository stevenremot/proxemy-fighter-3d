import {execCallbacks} from "./util";
import {Joystick} from "./touch/joystick";

/**
 * @description
 * Keyboard input source
 */
export class TouchInput {
    constructor(document, canvas) {
        this._callbacks = {
            onDirectionChanged: [],
            onPointerMoved: [],
            onFireStart: [],
            onFireEnd: []
        };

        this._touches = {
            joystick: null,
            pointer: null
        };

        this._canvas = canvas;

        this._joystick = new Joystick(document.getElementById('touch-joystick'));

        canvas.addEventListener('touchstart', (evt) => this._handleTouchStart(evt));
        canvas.addEventListener('touchend', (evt) => this._handleTouchEnd(evt));
        canvas.addEventListener('touchcancel', (evt) => this._handleTouchEnd(evt));
        canvas.addEventListener('touchleave', (evt) => this._handleTouchEnd(evt));
        canvas.addEventListener('touchmove', (evt) => this._handleTouchMove(evt));
    }

    /**
     * @description
     * Register a callback to call when the 2D movement is changing.
     *
     * The callback takes dx and dy as arguments, with values between
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

    /**
     * @description
     * Register a callback to call when the user is trying to move the
     * pointer.
     *
     * The callbacks takes dx and dy as arguments, which are not
     * bounded values.
     *
     * @param {Function} callback
     *
     * @returns this
     */
    onPointerMoved(callback) {
        this._callbacks.onPointerMoved.push(callback);
        return this;
    }

    /**
     * @description
     * Register a callback to call when the user is starting fire.
     *
     * @param {Function} callback
     *
     * @returns this
     */
    onFireStart(callback) {
        this._callbacks.onFireStart.push(callback);
        return this;
    }

    /**
     * @description
     * Register a callback to call when the user is ending fire.
     *
     * @param {Function} callback
     *
     * @returns this
     */
    onFireEnd(callback) {
        this._callbacks.onFireEnd.push(callback);
        return this;
    }

    _handleTouchStart(event) {
        let touch = event.changedTouches[0];

        if (this._isOnLeftPart(touch)) {
            this._touches.joystick = touch.identifier;
            this._joystick
                .resetHead()
                .show()
                .position = [touch.pageX, touch.pageY];
        }

        event.preventDefault();
    }

    _handleTouchEnd(event) {
        let joystickTouch = this._touches.joystick;
        for (let i = 0, l = event.changedTouches.length; i < l; i++) {
            let touch = event.changedTouches[i];
            if (joystickTouch === touch.identifier) {
                this._joystick.hide();
                this._touches.joystick = null;
                execCallbacks(this._callbacks.onDirectionChanged, 0, 0);
                break;
            }
        }
        event.preventDefault();
    }

    _handleTouchMove(event) {
        let joystickTouch = this._touches.joystick;
        for (let i = 0, l = event.changedTouches.length; i < l; i++) {
            let touch = event.changedTouches[i];
            if (joystickTouch === touch.identifier) {
                this._joystick.setHeadPosition(
                    touch.pageX,
                    touch.pageY
                );
                execCallbacks(
                    this._callbacks.onDirectionChanged,
                    ...this._joystick.direction
                );
                break;
            }
        }
        event.preventDefault();
    }

    _isOnLeftPart(touch) {
        return touch.pageX - this._canvas.offsetLeft <= this._canvas.offsetWidth / 2;
    }
}
