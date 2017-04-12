export class Votable {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public voteCount: number,
        public vetoCount: number,
    ) {}
}
