export class Turn {

    constructor() {

        this.round = null;

        this.playersQueue = [];

        this.winner = false;

        this.cards = [];
    }

    /**
     *
     * @return {Round}
     */
    getRound() {
        return this.round;
    }

    /**
     * @param {Round} round
     *
     */
    setRound(round) {
        this.round = round;
    }

    /**
     *
     * @return {Player}
     */
    getNextPlayerToGiver() {

        const giver = this.getRound().getPlayerWhoGiveCards();

        const index = this.getNextPlayerIndexToGiver(giver) + 1;

        return this.getRound().getPlayers()[index];
    }

    /**
     * @param {Player} giver
     *
     * @return {Number}
     */
    getNextPlayerIndexToGiver(giver) {

        let indexAnchor = 0;

        this.getRound().getPlayers().map((player, index) => {
            indexAnchor = Object.is(player, giver) ? index : indexAnchor;
        });

        return indexAnchor;
    }

    buildPlayersQueue() {

        let firstPlayerToBegin;

        // On est au 1er tour, le 1er a joué est celui après celui qui a distribué.
        if (!this.getRound().getPreviousTurn()) {
            firstPlayerToBegin = this.getNextPlayerToGiver();
        }
        else {
            // Sinon bah c'est celui qui a gagné au tour précédent
            firstPlayerToBegin = this.getRound().getPreviousTurn().getWinner();
        }

        if (typeof firstPlayerToBegin !== "undefined") {
            this.addPlayerInQueue(firstPlayerToBegin);
        }

        const playersWithoutTheBeginner = this.getRound().getPlayers().filter(player => {
            return !Object.is(player, firstPlayerToBegin);
        });

        let indexAnchor = this.getNextPlayerIndexToGiver(firstPlayerToBegin);

        // Tant qu'on a pas vidé la liste des joueurs restants
        // on va construite la queue.
        while (!!playersWithoutTheBeginner.length) {

            if (indexAnchor > 0) {

                for (let i = 0; i <= playersWithoutTheBeginner.length; i++) {

                    let a = playersWithoutTheBeginner.splice(indexAnchor, 1)[0];

                    if (typeof a === "undefined") {
                        continue;
                    }

                    this.addPlayerInQueue(a);
                }

                indexAnchor = 0;
            }
            else {
                this.addPlayerInQueue(playersWithoutTheBeginner.splice(0, 1)[0]);
            }
        }

        console.log('queue', this.getPlayersQueue());
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

    /**
     * @param {Player} player
     */
    addPlayerInQueue(player) {
        this.playersQueue.push(player);
    }

    getCards() {
        return this.cards;
    }
}
