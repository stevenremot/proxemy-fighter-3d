import THREE from "mrdoob/three.js";
import {Context as RenderContext} from "./render/context";
import {World} from "./world";
import {Ship} from "./world/ship";
import {Boss} from "./world/boss";
import {ShipShot} from "./world/shot/ship";
import {Aggregate as Input} from './input/aggregate';
import {Hud} from "./hud";

let hp = 10;
const FPS = 60;
const FRAME_DELAY = 1 / FPS;

const ORIGIN = new THREE.Vector3(0, 0, 0);

class App {
    constructor() {
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        let renderer = new THREE.WebGLRenderer();

        let renderContext = new RenderContext(renderer, camera, scene);
        this.world = new World(renderContext);

        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild(renderer.domElement);
        this.setupScene();
        this._frameTime = 0;
    }

    createBoss() {
        this.boss = this.world.createObject(Boss, 40);
        this.boss
            .addModule([0, Math.PI/3],[0, 2*Math.PI], 0xff0000)
            .addModule([Math.PI/3, Math.PI/2], [0, 3*Math.PI/4], 0x00ff00)
            .addModule([Math.PI/3, Math.PI/2], [3*Math.PI/4, 2*Math.PI], 0x0000ff);
    }

    setupScene() {
        this.ship = this.world.createObject(Ship, this.world, 50, 1);
        this.ship.position = new THREE.Vector3(50, 0, 0);
        this.ship.forward = new THREE.Vector3(-1, 0, 0);

        this.createBoss();


        let camera = this.world.renderContext.camera;
        camera.target = this.ship;
        camera.targetRelativePosition = new THREE.Vector3(0, 30, -30);
    }

    update(delay) {
        this._frameTime += delay;
        let changed = false;
        while (this._frameTime >= FRAME_DELAY) {
            this.world.update(FRAME_DELAY);
            this._frameTime -= FRAME_DELAY;
            changed = true;
        }
        if (changed) {
            this.world.renderContext.camera.updateRelativePosition().lookAt(ORIGIN);
            this.world.renderContext.render();
        }
    }
}

let app = new App();
let lastTime = null;

function render (time) {
    requestAnimationFrame( render );
    if (lastTime) {
        app.update((time - lastTime) / 1000);
    }
    lastTime = time;
}

render();

let hud = new Hud(document, hp);

let input = new Input(document, app.world.renderContext.domElement);
input
    .onDirectionChanged((dx, dy) => {
        app.ship.verticalSpeed = -dy;
        app.ship.horizontalSpeed = dx;
    })
    .onPointerMoved((dx, dy) => {
        hud.handlePointerMoved(dx, dy);
    })
    .onFireStart(() => console.log('Start fire'))
    .onFireEnd(() => {
        console.log('End fire');
        hp -= Math.random();
        hud.handleLifeChanged(hp);
    });

setInterval(
    () => app.world.createObject(
        ShipShot,
        new THREE.Vector3(100, 100, 100),
        new THREE.Vector3(-50, -50, -50),
        5
    ),
    100
);
