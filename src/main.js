/**
 * Copyright (C) 2015 The Proxemy Fighter 3D Team
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

import {WorldObject} from "./world/object";
import {App} from "./app";
import {addFullscreenToElement} from "./fullscreen";
import {setupAppcache} from "./appcache";
import {setupHelp} from "./help";
import {MessageScreen} from "./message-screen/base";
import {ModelLoader} from "./render/model-loader";
import 'lib/OBJMTLLoader';
import 'lib/OBJLoader';
import 'lib/MTLLoader';

document.exitPointerLock = document.exitPointerLock    ||
                           document.mozExitPointerLock ||
                           document.webkitExitPointerLock;

let startScreen = new MessageScreen(document.getElementById('game-start'));

setupAppcache(window.applicationCache, document.querySelector('#cache-update'));
setupHelp(
    startScreen,
    startScreen.domElement.querySelector('button'),
    document.querySelector('.command-help.keyboard'),
    document.querySelector('.command-help.touch')
);
addFullscreenToElement(document.getElementById('fullscreen-button'));

let loader = new ModelLoader();
loader.loadModels(new Map([
    ['gatling-base', 'assets/models/gatling-base'],
    ['gatling-cannon', 'assets/models/gatling-cannon'],
    ['ship', 'assets/models/ship'],
    ['ship-turret', 'assets/models/ship-turret'],
    ['ship-shotgun', 'assets/models/ship-shotgun'],
    ['miniship', 'assets/models/miniship']
])).then((models) => {

    let app = new App(
        window,
        startScreen,
        new MessageScreen(document.getElementById('game-end')),
        models
    );
    let lastTime = null;

    function render (time) {
        requestAnimationFrame( render );
        if (lastTime) {
            let delay = (time - lastTime) / 1000;
            if (delay < 1) {
                app.update((time - lastTime) / 1000);
            }
        }
        lastTime = time;
    }

    render();
});
