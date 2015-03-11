import {WorldObject} from "src/world/object";
import {FiniteStateMachine} from "src/core/fsm";
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

        this.maxLife = life;
        this.life = life;

        this.createFsm();
    }

    createFsm()
    {
        this._fsm = new FiniteStateMachine();
        this._fsm.addState("FullLife");
        this._fsm.addState("HalfBroken").addCallback(
            () => {this.model.material.wireframe = true;} 
        );
        this._fsm.addState("Broken").addCallback(
            () => {this.model.material.visible = false;}
        );
        this._fsm.setState("FullLife");
        this._fsm.addTransition("FullLife","HalfBroken");
        this._fsm.addTransition("HalfBroken","Broken");
    }

    handleLifeChanged(damage)
    {
        this.life -= damage;

        if (this.life < this.maxLife/2)
            this._fsm.callTransition("HalfBroken");

        if (this.life < 0)
            this._fsm.callTransition("Broken");  
    }
}
