import { User } from "./user";
import { Votable } from "./votable";

export class Room {
    constructor(
        public id: string,
        public name: string,
        public maxVotes: number,
        public maxVetos: number,
        public maxNominations: number,
        public roomState?: string,
        public users?: any,
        public votables?: any
    ) {}

    /**
     * addVotable
     */
     addVotable(v: Votable) {
        this.votables[v.id] = v;
    }
}