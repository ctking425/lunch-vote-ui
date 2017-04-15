import { Votable } from "./votable";

export class Room {
    constructor(
        public id: string,
        public name: string,
        public maxVotes: number,
        public maxVetos: number,
        public maxNominations: number,
        public readyTime?: number,
        public nominationTime?: number,
        public votingTime?: number,
        public roomState?: string,
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

    veto(vId: string) {
        let v: Votable = this.votables.find(votable => votable.id == vId);
        v.vetos++;
    }
}