/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

export class Lifebar {

    constructor(domElement, max_hp) {
        this.domElement = domElement;
        this._bar = domElement.querySelector('.lifebar-bar');
        this.max_hp = max_hp;
    }

    setPosition(x, y) {
        this.domElement.style.left = x;
        this.domElement.style.top = y;
    }

    update(current_hp) {
        let current_hp_percent = 100 * current_hp / this.max_hp;
        if (current_hp_percent < 0)
            current_hp_percent = 0;
        if (current_hp_percent > 100)
            current_hp_percent = 100;
        this._bar.setAttribute('width', current_hp_percent);
    }
}
