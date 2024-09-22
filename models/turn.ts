import { Player } from './player';
import { Card } from './card';

import { useStore } from 'vuex';

export class Turn {

    playersQueue: Array<Player>;

    winner!: Player;

    cards: Array<Card>;

    model: string;

    constructor() {

        this.playersQueue = [];

        this.cards = [];

        this.model = 'Turn';
    }

    getNextPlayerToGiver(): Player | null {

        const store = useStore();

        const round   = store.getters.round;
        const players = store.getters.players;

        const giver = round.getPlayerWhoGiveCards();

        if (!(giver instanceof Player)) {
            return null;
        }

        const index = this.getNextPlayerIndexToGiver(giver) + 1;

        return players[index];
    }

    getNextPlayerIndexToGiver(giver: Player | null): number {

        const store = useStore();

        let indexAnchor = 0;

        const players = store.getters.players;

        players.map((player: Player, index: number) => {
            indexAnchor = Object.is(player, giver) ? index : indexAnchor;
        });

        return indexAnchor;
    }

    buildPlayersQueue() {

        const store = useStore();

        let firstPlayerToBegin;

        const round   = store.getters.round;
        const players = store.getters.players;

        players.filter((player: Player) => {
            player.setCurrentCard(null);
        });

        // On est au 1er tour, le 1er a joué est celui après celui qui a distribué.
        console.log('TURN > BUILD PLAYERS QUEUE >', round.isFirstTurn());
        if (round.isFirstTurn()) {
            firstPlayerToBegin = this.getNextPlayerToGiver();
        }
        else {
            // Sinon bah c'est celui qui a gagné au Turn précédent
            firstPlayerToBegin = round.getPreviousTurn().getWinner();
        }

        // Don't ask ...
        if (typeof firstPlayerToBegin !== "undefined") {
            this.addPlayerInQueue(firstPlayerToBegin);
        }

        const playersWithoutTheBeginner = players.filter((player: Player) => {
            return !Object.is(player, firstPlayerToBegin);
        });

        let indexAnchor = this.getNextPlayerIndexToGiver(firstPlayerToBegin);

        // 1. Tant qu'on a pas vidé la liste des joueurs restants
        //    on va construite la queue.
        while (playersWithoutTheBeginner.length) {

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

        let winner : Player | null = null;

        this.getPlayersQueue().map(player => {

            if (!winner) {

                // On est dans le cas ou la 1ère carte joué est l'excuse
                if (player.getCurrentCard()?.isExcuse()) {
                    return
                }

                console.log('TURN > DETERMINE THE WINNER > default mode');
                winner = player;
                return;
            }

            let playerCurrentCard = player.getCurrentCard();
            let winnerCurrentCard = winner.getCurrentCard();

            if (!(playerCurrentCard instanceof Card)) {
                return;
            }

            if (!(winnerCurrentCard instanceof Card)) {
                return;
            }

            // L'excuse peut pas gagner
            if (playerCurrentCard.isExcuse()) {
                console.log('TURN > DETERMINE THE WINNER > excuse');
                return;
            }

            // Le 21 gagne tout le temps
            if (playerCurrentCard.is21()) {
                winner = player;
                console.log('TURN > DETERMINE THE WINNER > 21');
                return;
            }

            // Si le joueur a mis un atout et l'autre un signe
            // Il gagne
            if (playerCurrentCard.isAtout() && !winnerCurrentCard.isAtout()) {
                winner = player;
                console.log('TURN > DETERMINE THE WINNER > atout win');
                return;
            }

            // Si les cartes sont de même signe, on va juste comparé les index
            // ici on trust à fond le fait qu'une fausse carte
            // ne soit pas dans la liste
            if (playerCurrentCard.getSign() === winnerCurrentCard.getSign()) {

                if (playerCurrentCard.getIndex() > winnerCurrentCard.getIndex()) {
                    console.log('TURN > DETERMINE THE WINNER > sign win');
                    winner = player;
                    return;
                }
            }
        });

        console.log('TURN > DETERMINE THE WINNER >', winner);

        this.setWinner(winner);
    }

    /**
     * @description Le gagnant récupère les cartes
     *
     */
    pickUpCards() {

        const store = useStore();

        const round = store.getters.round;

        const winner = this.getWinner();

        if (!winner) { return; }

        round.getAttackerPlayers().includes(winner) ?
        round.addAttackerStackCards(this.getCards()) : round.addDefenderStackCards(this.getCards());
    }

    resetPlayersCurrentCard() {

        const store = useStore();

        const players = store.getters.players;

        if (players.length <= 0) {
            return;
        }

        players.map((player: Player) => {
            player.setCurrentCard(null);
        });
    }

    getWinner() : Player {
        return this.winner;
    }

    setWinner(player : Player | null) {

        if (!(player instanceof Player)) {
            return;
        }

        this.winner = player;
    }

    getPlayersQueue() : Array<Player> {
        return this.playersQueue;
    }

    addPlayerInQueue(player : Player | null) {

        if (!(player instanceof Player)) {
            return;
        }

        this.playersQueue.push(player);
    }

    getCards() : Array<Card> {
        return this.cards;
    }

    addCard(card : Card) {
        this.getCards().push(card);
    }

    havePetitInCards(): Boolean {
        return this.getCards().some((card: Card) => card.isPetit());
    }

    haveExcuseInCards(): Boolean {
        return this.getCards().some((card: Card) => card.isExcuse());
    }
}
