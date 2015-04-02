/**
 * Copyright (C) 2015 The Proxemy Fighter 3D Team
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

export class Score {
    constructor(domElement) {
        this.domElement = domElement;
        this.value = 0;
    }

    add(points) {
        this.value += points;
        this.domElement.textContent = this.value.toString();
    }
}
