export class Votable {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public votes: number,
        public vetos: number
    ) {}
}
