import {WorldObject} from "src/world/object";
import THREE from "mrdoob/three.js";

export class Module extends WorldObject {
    constructor(world,
                radius,
                thetaRange,
                phiRange,
                material,
                life) 
    {
        super(world);
        
        let widthSegments = 24; //default value
        let heightSegments = 18; //default value
        let geometry = new THREE.SphereGeometry(radius,
                                                widthSegments,
                                                heightSegments,
                                                phiRange[0],
                                                phiRange[1]-phiRange[0],
                                                thetaRange[0],
                                                thetaRange[1]-thetaRange[0]);
        this.model = new THREE.Mesh(geometry, material);

        this.life = life;
    }
}
