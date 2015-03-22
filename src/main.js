import {WorldObject} from "./world/object";
import {App} from "./app";
import {addFullscreenToElement} from "./fullscreen";
import {MessageScreen} from "./message-screen/base";
import {ModelLoader} from "./render/model-loader";
import 'OBJLoader';

document.exitPointerLock = document.exitPointerLock    ||
                           document.mozExitPointerLock ||
                           document.webkitExitPointerLock;

let loader = new ModelLoader();
loader.loadModels(new Map([
    ['gatling-base', 'assets/models/gatling-base.obj'],
    ['gatling-cannon', 'assets/models/gatling-cannon.obj']
])).then((models) => {
    let app = new App(
        window,
        new MessageScreen(document.getElementById('game-start')),
        new MessageScreen(document.getElementById('game-end')),
        models
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
}).catch((error) => console.log(error));
