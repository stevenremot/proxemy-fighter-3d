import {execCallbacks} from 'src/core/util';

function getLifeContainerStructure(lifeContainer) {
    if (!("_lifeContainer" in lifeContainer)) {
        lifeContainer._lifeContainer = {
            lifeChangedCallbacks: []
        };
    }
    return lifeContainer._lifeContainer;
}

function handleLifeChanged(lifeContainer) {
    execCallbacks(getLifeContainerStructure(lifeContainer).lifeChangedCallbacks);
}

/**
 * @description
 * A mixin for objects that have a life bar and can take damages.
 */
export let LifeContainer = {
    life: 0,

    hurt(damages) {
        this.life -= damages;
        handleLifeChanged(this);
    },

    isAlive() {
        return this.life > 0;
    },

    onLifeChanged(callback) {
        getLifeContainerStructure(this).lifeChangedCallbacks.push(callback);
    }
};
