import { User } from "./user";
import { Votable } from "./votable";

export class Room {

    constructor(
        public name: string,
        public maxVotes: number,
        public maxVetos: number,
        public maxNominations: number,
        public roomState?: string,
        public users?: Map<string, User>,
        public votables?: Map<string, Votable>
    ) {}
}