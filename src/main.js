import THREE from "mrdoob/three.js";
import {Context as RenderContext} from "./render/context";
import {World} from "./world";
import {KeyboardInput} from './input/keyboard';

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
        let geometry = new THREE.BoxGeometry( 1, 1, 1 );
        let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        let model = new THREE.Mesh( geometry, material );
        this.cube = this.world.createObject();
        this.cube.model = model;

        this.world.renderContext.camera.position.z = 5;
    }

    update() {
        this.cube.rotate(0.1, 0.1, 0);
        this.world.renderContext.render();
    }
}

let app = new App();

function render () {
    requestAnimationFrame( render );
    app.update();
}

render();

let input = new KeyboardInput(document, app.world.renderContext.domElement);
input
    .onDirectionChanged((dx, dy) => console.log('Direction', dx, dy))
    .onPointerMoved((dx, dy) => console.log('Pointer', dx, dy))
    .onFireStart(() => console.log('Start fire'))
    .onFireEnd(() => console.log('End fire'));
