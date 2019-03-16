/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

import {OBJLoader, MTLLoader} from 'three-obj-mtl-loader';

import {WorldObject} from "./world/object";
import {App} from "./app";
import {addFullscreenToElement} from "./fullscreen";
import {setupAppcache} from "./appcache";
import {setupHelp} from "./help";
import {MessageScreen} from "./message-screen/base";
import {ModelLoader} from "./render/model-loader";
import * as resources from './resources';

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
    ['gatling-base', resources.gatlingBase],
    ['gatling-cannon', resources.gatlingCannon],
    ['ship', resources.ship],
    ['ship-turret', resources.shipTurret],
    ['ship-shotgun', resources.shipShotgun],
    ['miniship', resources.miniship]
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
