export class User {
    constructor(
        public id: string,
        public name: string,
        public votes: number,
        public vetos: number,
        public nominations: number
    ) {}
}