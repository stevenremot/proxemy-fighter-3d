import THREE from "mrdoob/three.js";
import {Context as RenderContext} from "./render/context";
import {World} from "./world";
import {KeyboardInput} from './input/keyboard';
import {TouchInput} from './input/touch';

var dtheta = 0;
var dphi = 0;

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
        this.cube = this.world.createObject();
        this.cube.model = model;

        this.world.renderContext.camera.move(new THREE.Vector3(0,0,100));
    }

    update() {
        this.world.renderContext.camera.sphericalMove(dtheta, dphi);
        //this.cube.rotate(0.1, 0.1, 0);
        this.world.renderContext.render();
    }
}

let app = new App();

function render () {
    requestAnimationFrame( render );
    app.update();
}

render();

let input = new TouchInput(document, app.world.renderContext.domElement);
input
    .onDirectionChanged((dx, dy) => {
        dtheta = dy/100;
        dphi = dx/100;
        console.log(dtheta, dphi);
    })
    .onPointerMoved((dx, dy) => console.log('Pointer', dx, dy))
    .onFireStart(() => console.log('Start fire'))
    .onFireEnd(() => console.log('End fire'));
