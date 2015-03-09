import THREE from "mrdoob/three.js";
import {Context as RenderContext} from "./render/context";
import {World} from "./world";
import {Ship} from "./world/ship";
import {Boss} from "./world/boss";
import {Aggregate as Input} from './input/aggregate';
import {Hud} from "./hud";

var dtheta = 0;
var dphi = 0;
var hp = 10;

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
    }

    createBoss() {
        this.boss = new Boss(this.world, 40);
        this.boss
            .addModule([0, Math.PI/3],[0, 2*Math.PI], 0xff0000)
            .addModule([Math.PI/3, Math.PI/2], [0, 3*Math.PI/4], 0x00ff00)
            .addModule([Math.PI/3, Math.PI/2], [3*Math.PI/4, 2*Math.PI], 0x0000ff);
    }

    setupScene() {
        let geometry = new THREE.BoxGeometry(32, 32, 32, 1, 1, 1);

        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");

        context.fillStyle="red";
        context.fillRect(0,0,32,32);
        let redData = context.getImageData(0,0,32,32);
        let red = new THREE.Texture(redData);
        red.needsUpdate = true;

        context.fillStyle="blue";
        context.fillRect(0,0,32,32);
        let blueData = context.getImageData(0,0,32,32);
        let blue = new THREE.Texture(blueData);
        blue.needsUpdate = true;

        let materials = [
            new THREE.MeshBasicMaterial({map: red}),
            new THREE.MeshBasicMaterial({map: blue}),
            new THREE.MeshBasicMaterial({color: 0x00ff00}),
            new THREE.MeshBasicMaterial({color: 0xffff00}),
            new THREE.MeshBasicMaterial({color: 0xff00ff}),
            new THREE.MeshBasicMaterial({color: 0x00ffff})
        ];

        let model = new THREE.Mesh(
            geometry,
            new THREE.MeshFaceMaterial(materials)
        );
        // this.cube = this.world.createObject();
        // this.cube.model = model;      
        
        this.ship = new Ship(this.world, 50, 1);
        this.ship.position = new THREE.Vector3(50, 0, 0);

        this.createBoss();

        this.world.renderContext.camera.move(new THREE.Vector3(0,0,100));
    }

    update() {
        this.ship.moveOnSphere(dtheta, dphi);
        this.ship.lookAt(new THREE.Vector3(0, 0, 0));
        this.world.renderContext.render();
    }
}

let app = new App();

function render () {
    requestAnimationFrame( render );
    app.update();
}

render();

let hud = new Hud(document, hp);

let input = new Input(document, app.world.renderContext.domElement);
input
    .onDirectionChanged((dx, dy) => {
        dtheta = dy/100;
        dphi = dx/100;
        console.log(dtheta, dphi);
    })
    .onPointerMoved((dx, dy) => {
        console.log('Pointer', dx, dy);
        hud.handlePointerMoved(dx, dy);
    })
    .onFireStart(() => console.log('Start fire'))
    .onFireEnd(() => {
        console.log('End fire');
        hp -= Math.random();
        hud.handleLifeChanged(hp);
    });
