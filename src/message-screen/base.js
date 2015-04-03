/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

/**
 * @description
 * Provide all basic manipulation for screens that display messages
 * over the game area.
 */
export class MessageScreen {
    constructor(domElement) {
        this.domElement = domElement;
    }

    show() {
        this.domElement.style.display = "block";
    }

    hide() {
        this.domElement.style.display = "none";
    }

    onClick(callback) {
        this.domElement.addEventListener('click', callback);
    }

    isShown() {
        return this.domElement.style.display !== "none";
    }

    get message() {
        return this.domElement.querySelector('.message').textContent;
    }

    set message(message) {
        this.domElement.querySelector('.message').textContent = message;
    }
}
