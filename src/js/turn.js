export class Turn {

    constructor() {

        /* @var Round */
        this.round = null;

        /* @var array<Player> */
        this.players = [];

        /* @var array<Player> */
        this.playersQueue = [];

        /* @var Player */
        this.winner = false;

        /* @var array<Player> */
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
     * @return {Players}
     */
    getPlayers() {
        return this.players;
    }

    /**
     * @param {players} players
     *
     */
    setPlayers(players) {
        this.players = players;
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

        // Don't ask ...
        if (typeof firstPlayerToBegin !== "undefined") {
            this.addPlayerInQueue(firstPlayerToBegin);
        }

        const playersWithoutTheBeginner = this.getRound().getPlayers().filter(player => {
            return !Object.is(player, firstPlayerToBegin);
        });

        let indexAnchor = this.getNextPlayerIndexToGiver(firstPlayerToBegin);

        // 1. Tant qu'on a pas vidé la liste des joueurs restants
        //    on va construite la queue.
        while (!!playersWithoutTheBeginner.length) {

            // 1.1 Le joueur qui commence est en milieu de liste,
            //     on se positionne dans le tableau et on boucle.
            if (indexAnchor > 0) {

                for (let i = 0; i <= playersWithoutTheBeginner.length; i++) {

                    let a = playersWithoutTheBeginner.splice(indexAnchor, 1)[0];

                    // Don't ask too ...
                    if (typeof a === "undefined") {
                        continue;
                    }

                    this.addPlayerInQueue(a);
                }

                indexAnchor = 0;
            }
            else {

                // 1.2 On est ( ou revenu ) au début du tableau.
                //     On balance le reste.
                this.addPlayerInQueue(playersWithoutTheBeginner.splice(0, 1)[0]);
            }
        }
    }

    determineTheWinner() {

        let winner = false;

        this.getPlayersQueue().map(player => {

            if (!winner) {
                winner = player;
            }

        });

        this.setWinner(winner);
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

    /**
     *
     * @return {array<Card>}
     */
    getCards() {
        return this.cards;
    }

    /**
     * @param {Card} card
     *
     */
    addCard(card) {
        this.cards.push(card);
    }
}
