export class Pattern {
    constructor(period) {
        this.period = period;
        this._count = NaN;

        this._currentShootPositions = [];
        this._firstShoot = null;
        this._currentShoot = null;
    }

    /**
     * Add a shoot to the pattern
     * @param relativePosition: [rightOffset, upOffset]
     * @param time: must be more than last shoot's time and less than this.period
     */
    addShoot(relativePosition, time) {
        let shoot = {
            pos: relativePosition,
            time: time,
            next: null
        };

        if (!this._firstShoot) {
            this._firstShoot = shoot;
        }
        else if (!this._currentShoot) {
            this._currentShoot = shoot;
            this._firstShoot.next = this._currentShoot;
        }
        else {
            this._currentShoot.next = shoot;
            this._currentShoot = shoot;
        }
        
        return this;
    }

    update(dt) {
        this._currentShootPositions = [];
        this._count += dt;
        
        if (!this._count || this._count > this.period) {
            // reinit
            this._count = 0;
            this._currentShoot = this._firstShoot;
        }
        else if (this._currentShoot) {
            let t = this._currentShoot.time;
            while(this._count > t) {
                this._currentShootPositions.push(this._currentShoot.pos);
                this._currentShoot = this._currentShoot.next;
                if (!this._currentShoot)
                    t = this._count;
                else 
                    t = this._currentShoot.time;
            }
        }
        
        return this._currentShootPositions;
    }


}
