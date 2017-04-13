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
        public users?: User[],
        public votables?: Votable[]
    ) {}

    /**
     * addVotable
     */
     addVotable(v: Votable) {
        this.votables.push(v);
    }

    vote(vId: string) {
        let v: Votable = this.votables.find(votable => votable.id == vId);
        v.votes++;
    }
}