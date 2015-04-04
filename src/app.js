/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

import THREE from "mrdoob/three.js";

import {Ship} from "./world/ship";
import {Boss} from "./world/boss";
import {Context as RenderContext} from "./render/context";
import {World} from "./world";
import {Hud} from "./hud";
import {Detector} from "./ai/detection";
import {BuddyCube} from "./world/ai-vessel";
import {Aggregate as Input} from './input/aggregate';

const MAX_LIFE = 10;
const FPS = 60;
const FRAME_DELAY = 1 / FPS;

const ORIGIN = new THREE.Vector3(0, 0, 0);

export class App {
    constructor(window, startScreen, endScreen, models) {
        let params = this.createRenderContext(window, models);
        this.world = new World(params.renderContext, params.detector);

        this.hud = new Hud(window, MAX_LIFE);
        this.hud.sights.onPositionChanged(
            (x, y) => {
                this._aimedPos.x = x;
                this._aimedPos.y = y;
            }
        );

        this.setupScene();
        this._frameTime = 0;

        this._startScreen = startScreen;
        this._endScreen = endScreen;
        this._isInGame = false;

        this._startScreen.onClick(() => this.startGame(window));
        this._endScreen.onClick(() => this.restartGame(window));

        this._aimedPos = {
            x: 0,
            y: 0
        };

        this._startScreen.message = 'Click / touch to start';

    }

    updateShipAimedPoint() {
        this.world.renderContext.camera.getAimedPointForPosition(
            this._aimedPos.x,
            this._aimedPos.y,
            200, // Depth = camera position
            this.ship.aimedPoint
        );
        this.ship.updateCannonOrientation();
    }

    createRenderContext(window, models) {
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.light = new THREE.PointLight(0xffffff, 1, 500);
        this.shiplight = new THREE.PointLight(0xffffff, 1, 50);
        scene.add(this.light);
        scene.add(this.shiplight);
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

    createSky() {
        let geometry = new THREE.SphereGeometry(250,60,40);
        let uniforms = {
            topColor: {type: "c", value: new THREE.Color(0x001133)},
            bottomColor: {type: "c", value: new THREE.Color(0xff2222)},
            offset: {type: "f", value: 100},
            exponent: {type: "f", value: 0.5}
        };
        let skyMaterial = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('sky-vertex').textContent,
            fragmentShader: document.getElementById('sky-fragment').textContent,
            uniforms: uniforms,
            side: THREE.BackSide,
            fog: false
        });
        let sky = new THREE.Mesh(geometry, skyMaterial);
        this.world.renderContext.scene.add(sky);
    }

    createBoss() {
        let moduleColor = 0x5000c0;
        this.boss = this.world.createObject(Boss, 40);
        this.boss
            .onDead(() => {
                this.destroyVessels();
                this.showEndScreen('You won!');
            })
            .addModule([0, Math.PI/3],[0, 2*Math.PI], moduleColor)
            .addModule([Math.PI/3, Math.PI/2], [0, 3*Math.PI/4], moduleColor)
            .addModule([Math.PI/3, Math.PI/2], [3*Math.PI/4, 2*Math.PI], moduleColor)
            .addModule([Math.PI/2, 2 * Math.PI / 3], [0, 2 * Math.PI / 3], moduleColor)
            .addModule([Math.PI/2, 2 * Math.PI / 3], [2 * Math.PI / 3, 4 * Math.PI / 3], moduleColor)
            .addModule([Math.PI/2, 2 * Math.PI / 3], [4 * Math.PI / 3, 2 * Math.PI], moduleColor)
            .addModule([2 * Math.PI / 3, Math.PI], [0, Math.PI], moduleColor)
            .addModule([2 * Math.PI / 3, Math.PI], [Math.PI, 2 * Math.PI], moduleColor);

    }

    setupShip() {
        this.ship = this.world.createObject(Ship, 1, MAX_LIFE);
        this.ship.position = new THREE.Vector3(150, 0, 0);
        this.ship.forward = new THREE.Vector3(-1, 0, 0);
        this.ship.onLifeChanged(() => {
            this.hud.handleLifeChanged(this.ship.life);
            if (!this.ship.isAlive()) {
                this.showEndScreen('You lost :\'(');
            }
        });
        this.hud.handleLifeChanged(this.ship.life);
    }

    setupVessels() {
        this.vessels = new Set();
        this.vessels.add(this.world.createObject(BuddyCube, 30, this.ship));

        let vessel;
        vessel = this.world.createObject(BuddyCube, 30, this.ship);
        vessel.position.set(-30, 50, 0);
        this.vessels.add(vessel);

        vessel = this.world.createObject(BuddyCube, 30, this.ship);
        vessel.position.set(-30, 50, 0);
        this.vessels.add(vessel);

        vessel = this.world.createObject(BuddyCube, 30, this.ship);
        vessel.position.set(-30, 50, 0);
        this.vessels.add(vessel);
    }

    destroyVessels() {
        for (let vessel of this.vessels) {
            if (vessel.isAlive()) {
                vessel.hurt(30000);
            }
        }
    }

    setupScene() {
        this.setupShip();
        this.setupVessels();
        this.createBoss();
        this.createSky();

        let camera = this.world.renderContext.camera;
        camera.target = this.ship;
        camera.targetRelativePosition = new THREE.Vector3(0, 40, -45);
    }

    update(delay) {
        this._frameTime += delay;
        let changed = false;

        if (this.isInGame()) {
            while (this._frameTime >= FRAME_DELAY) {
                this.world.update(FRAME_DELAY);
                this.world.renderContext.camera
                    .updateRelativePosition()
                    .lookAt(ORIGIN);
                this._frameTime -= FRAME_DELAY;
                changed = true;
            }
        } else {
            this._frameTime = 0;
            this.world.renderContext.camera
                .updateRelativePosition()
                .lookAt(ORIGIN);
        }

        if (changed || !this.isInGame()) {
            this.light.position.copy(this.world.renderContext.camera.position);
            this.shiplight.position.copy(this.ship.position)
                .add(this.ship.forward.clone().multiplyScalar(5))
                .add(this.ship.up.clone().multiplyScalar(15));
            this.updateShipAimedPoint();
            this.world.renderContext.camera.computeFrustum();
            this.world.renderContext.render();
        }
    }

    isInGame() {
        return this._isInGame;
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

        if (!this.input) {
            this.input = this.createInput(window);
        }
        this.input.lock();
        this._isInGame = true;
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
