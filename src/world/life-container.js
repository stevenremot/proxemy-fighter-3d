import {execCallbacks} from 'src/core/util';

function getLifeContainerStructure(lifeContainer) {
    if (!("_lifeContainer" in lifeContainer)) {
        lifeContainer._lifeContainer = {
            lifeChangedCallbacks: []
        };
    }
    return lifeContainer._lifeContainer;
}

/**
 * @description
 * A mixin for objects that have a life bar and can take damages.
 */
export let LifeContainer = {
    life: 0,

    hurt(damages) {
        this.life -= damages;
        this._handleLifeChanged();
    },

    isAlive() {
        return this.life > 0;
    },

    _handleLifeChanged() {
        execCallbacks(getLifeContainerStructure(this).lifeChangedCallbacks);
    },

    onLifeChanged(callback) {
        getLifeContainerStructure(this).lifeChangedCallbacks.push(callback);
    }
};
