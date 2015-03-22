import {WorldObject} from "./world/object";
import {App} from "./app";
import {addFullscreenToElement} from "./fullscreen";
import {MessageScreen} from "./message-screen/base";

document.exitPointerLock = document.exitPointerLock    ||
                           document.mozExitPointerLock ||
                           document.webkitExitPointerLock;

let app = new App(
    window,
    new MessageScreen(document.getElementById('game-start')),
    new MessageScreen(document.getElementById('game-end'))
);
let lastTime = null;

addFullscreenToElement(document.getElementById('fullscreen-button'));

function render (time) {
    requestAnimationFrame( render );
    if (lastTime) {
        app.update((time - lastTime) / 1000);
    }
    lastTime = time;
}

render();
