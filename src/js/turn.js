export class Turn {

    constructor() {

        this.playersQueue = [];

        this.winner = false;

        this.cards = [];
    }

    /**
     *
     * @return {Player}
     */
    getWinner() {
        return this.winner;
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
