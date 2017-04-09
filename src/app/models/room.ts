import { User } from "./user";
import { Votable } from "./votable";

export class Room {
    name: string;
    maxVotes: number;
    maxVetos: number;
    maxNominations: number;
    roomState: string;
    users: Map<string, User>;
    votables: Map<string, Votable>;
}