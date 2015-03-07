import THREE from "mrdoob/three.js";

class App {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
        this.setupScene();
    }

    setupScene() {
        let geometry = new THREE.BoxGeometry( 1, 1, 1 );
        let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( geometry, material );
        this.scene.add(this.cube);
        this.camera.position.z = 5;
    }

    update() {
        this.cube.rotation.x += 0.1;
        this.cube.rotation.y += 0.1;
        this.renderer.render(this.scene, this.camera);
    }
}

let app = new App();

function render () {
    requestAnimationFrame( render );
    app.update();
}

render();
