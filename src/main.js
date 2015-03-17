import THREE from "mrdoob/three.js";
import {Context as RenderContext} from "./render/context";
import {World} from "./world";
import {Ship} from "./world/ship";
import {Boss} from "./world/boss";
import {Aggregate as Input} from './input/aggregate';
import {Hud} from "./hud";

let hp = 10;
const FPS = 60;
const FRAME_DELAY = 1 / FPS;

const ORIGIN = new THREE.Vector3(0, 0, 0);

class App {
    constructor(window) {
        this.world = new World(this.createRenderContext(window));

        this.setupScene();
        this._frameTime = 0;

        this._startScreen = window.document.getElementById('game-start');

        this._startScreen.addEventListener(
            'click',
            () => this.startGame(window)
        );
    }

    createRenderContext(window) {
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        let renderer = new THREE.WebGLRenderer();

        let renderContext = new RenderContext(renderer, camera, scene);
        renderer.setSize(window.innerWidth, window.innerHeight);
        window.addEventListener(
            "resize",
            () => renderContext.setSize(window.innerWidth, window.innerHeight)
        );

        document.body.appendChild(renderer.domElement);
        return renderContext;
    }

    createInput(window) {
        let renderContext = this.world.renderContext;

        let input = new Input(document, renderContext.domElement);
        return input
            .onDirectionChanged((dx, dy) => {
                this.boss.modules[0].handleLifeChanged(1);
                this.ship.verticalSpeed = -dy;
                this.ship.horizontalSpeed = dx;
            })
            .onPointerMoved((dx, dy) => {
                this.hud.handlePointerMoved(dx, dy, renderContext.camera);
            })
            .onFireStart(() => this.ship.isShooting = true)
            .onFireEnd(() => {
                hp -= Math.random();
                this.hud.handleLifeChanged(hp);
                this.ship.isShooting = false;
            });
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
        this.ship.position = new THREE.Vector3(200, 0, 0);
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
            this.world.renderContext.camera.updateAimedPoint();
            this.world.renderContext.render();
        }
    }

    startGame(window) {
        this._startScreen.style.display = "none";
        window.document.getElementById('lifebar').style.display = "block";
        window.document.getElementById('sights').style.display = "block";
        this.hud = new Hud(window, hp);
        this.boss.hud = this.hud;
        this.input = this.createInput(window);
    }
}

let app = new App(window);
let lastTime = null;

function render (time) {
    requestAnimationFrame( render );
    if (lastTime) {
        app.update((time - lastTime) / 1000);
    }
    lastTime = time;
}

render();
