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
