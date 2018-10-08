export class Turn {

    constructor() {

        this.playersQueue = [];

        this.cards = [];
    }

    /**
     *
     * @return {array<Player>}
     */
    getPlayersQueue() {
        return this.playersQueue;
    }

    getCards() {
        return this.cards;
    }
}
