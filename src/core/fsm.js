/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

import {execCallbacks} from "./util";

/**
 * Usage example:
 * let fsm = new FiniteStateMachine();
 * fsm.addState("Hello").addCallback(() => console.log("Hello!"));
 * fsm.addState("Goodbye").addCallback(() => console.log("Goodbye!"));
 * fsm.addTransition("Hello", "Goodbye").addCallback(() => console.log("..."));
 *
 * fsm.setState("Hello")
 * > Hello!
 * fsm.callTransition("Goodbye")
 * > ...
 * > Goodbye!
 */

export class CallbackCollection {
    constructor() {
        this.callbacks = [];
    }

    /**
     * Associate callbacks to a state or a transition
     * Can be chained
     * All callbacks need to have the same arguments
     */
    addCallback(callback) {
        this.callbacks.push(callback);
        return this;
    }

}

export class FiniteStateMachine {
    constructor() {
        this._states = new Map();
        this._transitions = new Map();
        this.currentState = null;
    }

    /**
     * Add a state and returns it
     */
    addState(name) {
        this._states.set(name, new CallbackCollection());
        return this._states.get(name);
    }

    /**
     * Add a transition between state1 and state2 and returns it
     */
    addTransition(state1, state2) {
        this._transitions.set(state1+"->"+state2, new CallbackCollection());
        return this._transitions.get(state1+"->"+state2);
    }

    /**
     * Set current state and executes its callbacks
     * You can use it directly if you don't need transitions
     */
    setState(name, ...args) {
        this.currentState = name;
        let callbacks = this._states.get(name).callbacks;
        execCallbacks(callbacks, ...args);
    }

    /**
     * Transition from this._currentState to newState
     * Executes transition callback(s) then newState callback(s)
     * Callbacks for transition and newState must have the same arguments
     */
    callTransition(newState, ...args) {
        if (this._transitions.has(this.currentState+"->"+newState)) {
            execCallbacks(
                this._transitions.get(this.currentState+"->"+newState).callbacks,
                ...args
            );
            execCallbacks(this._states.get(newState).callbacks, ...args);
            this.currentState = newState;
        }
    }
}
