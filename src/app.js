import THREE from "mrdoob/three.js";

import {Ship} from "./world/ship";
import {Boss} from "./world/boss";
import {Context as RenderContext} from "./render/context";
import {World} from "./world";
import {Hud} from "./hud";
import {Detector} from "./ai/detection";
import {BuddyCube} from "./world/ai-vessel";
import {Aggregate as Input} from './input/aggregate';

const MAX_LIFE = 50;
const FPS = 60;
const FRAME_DELAY = 1 / FPS;

const ORIGIN = new THREE.Vector3(0, 0, 0);

export class App {
    constructor(window, startScreen, endScreen, models) {
        let params = this.createRenderContext(window, models);
        this.world = new World(params.renderContext, params.detector);

        this.setupScene();
        this._frameTime = 0;

        this._startScreen = startScreen;
        this._endScreen = endScreen;

        this._startScreen.onClick(() => this.startGame(window));
        this._endScreen.onClick(() => this.restartGame(window));

        this._aimedPos = {
            x: 0,
            y: 0
        };

        this.hud = new Hud(window, MAX_LIFE);
        this.hud.sights.onPositionChanged(
            (x, y) => {
                this._aimedPos.x = x;
                this._aimedPos.y = y;
            }
        );

        this._startScreen.message = 'Click / touch to start';

    }

    updateShipAimedPoint() {
        this.world.renderContext.camera.getAimedPointForPosition(
            this._aimedPos.x,
            this._aimedPos.y,
            200, // Depth, empirimagical value
            this.ship.aimedPoint
        );
    }

    createRenderContext(window, models) {
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        let renderer = new THREE.WebGLRenderer();

        let renderContext = new RenderContext(renderer, camera, scene, models);
        renderer.setSize(window.innerWidth, window.innerHeight);
        window.addEventListener(
            "resize",
            () => renderContext.setSize(window.innerWidth, window.innerHeight)
        );

        let detector = new Detector(renderContext.camera, scene);

        document.body.appendChild(renderer.domElement);
        return {renderContext: renderContext, detector: detector};
    }

    createInput(window) {
        let renderContext = this.world.renderContext;

        let input = new Input(document, renderContext.domElement);
        return input
            .onDirectionChanged((dx, dy) => {
                this.ship.verticalSpeed = -dy;
                this.ship.horizontalSpeed = dx;
            })
            .onPointerMoved((dx, dy) => {
                this.hud.handlePointerMoved(dx, dy);
            })
            .onFireStart(() => this.ship.isShooting = true)
            .onFireEnd(() => {
                this.ship.isShooting = false;
            });
    }

    createBoss() {
        this.boss = this.world.createObject(Boss, 40);
        this.boss
            .onDead(() => this.showEndScreen('You won!'))
            .addModule([0, Math.PI/3],[0, 2*Math.PI], 0xff0000)
            .addModule([Math.PI/3, Math.PI/2], [0, 3*Math.PI/4], 0x00ff00)
            .addModule([Math.PI/3, Math.PI/2], [3*Math.PI/4, 2*Math.PI], 0x0000ff);
    }

    setupScene() {
        this.ship = this.world.createObject(Ship, 50, 1, MAX_LIFE);
        this.ship.position = new THREE.Vector3(200, 0, 0);
        this.ship.forward = new THREE.Vector3(-1, 0, 0);
        this.ship.onLifeChanged(() => {
            this.hud.handleLifeChanged(this.ship.life);
            if (!this.ship.isAlive()) {
                this.showEndScreen('You lost :\'(');
            }
        });

        this.cube = this.world.createObject(BuddyCube, 30, this.ship);
        this.cube.onDead(() => this.cube.destroy());

        this.createBoss();

        let camera = this.world.renderContext.camera;
        camera.target = this.ship;
        camera.targetRelativePosition = new THREE.Vector3(0, 30, -30);
    }

    update(delay) {
        this._frameTime += delay;
        let changed = false;
        while (this._frameTime >= FRAME_DELAY) {
            if (this.isInGame()) {
                this.world.update(FRAME_DELAY);
            }
            this._frameTime -= FRAME_DELAY;
            changed = true;
        }
        if (changed) {
            this.world.renderContext.camera
                .updateRelativePosition()
                .lookAt(ORIGIN);
            this.updateShipAimedPoint();
            this.world.renderContext.camera.computeFrustum();
            this.world.renderContext.render();
        }
    }

    isInGame() {
        return !this._startScreen.isShown();
    }

    restartGame(window) {
        this.world.clear();
        this.setupScene();
        this.startGame(window);
    }

    startGame(window) {
        this._startScreen.hide();
        this._endScreen.hide();

        window.document.getElementById('lifebar').style.display = "block";
        window.document.getElementById('sights').style.display = "block";
        this.boss.hud = this.hud;
        this.input = this.createInput(window);
    }

    showEndScreen(message) {
        this.ship.isShooting = false;
        document.exitPointerLock();
        this._endScreen.message = message;
        this._endScreen.show();

        window.document.getElementById('lifebar').style.display = "none";
        window.document.getElementById('sights').style.display = "none";
    }
}