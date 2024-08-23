import { Player } from './player';
import { Round } from './round';
import { Card } from './card';

import { store } from './store';

export class Turn {

    round!: Round;

    playersQueue: Array<Player>;

    winner!: Player;

    cards : Array<Card>;

    currentPlayer!: Player;

    constructor() {

        this.playersQueue = [];

        this.cards = [];
    }

    getRound() : Round {
        return this.round;
    }

    setRound(round : Round) : void {
        this.round = round;
    }

    getCurrentPlayer() : Player {
        return this.currentPlayer;
    }

    setCurrentPlayer(player: Player) : void {
        this.currentPlayer = player;
    }

    getNextPlayerToGiver() : Player | null {

        const giver = this.getRound().getPlayerWhoGiveCards();

        if (!(giver instanceof Player)) {
            return null;
        }

        const index = this.getNextPlayerIndexToGiver(giver) + 1;

        return store.state.players[index];
    }

    getNextPlayerIndexToGiver(giver : Player | null): number {

        let indexAnchor = 0;

        store.state.players.map((player, index) => {
            indexAnchor = Object.is(player, giver) ? index : indexAnchor;
        });

        return indexAnchor;
    }

    buildPlayersQueue() : void {

        let firstPlayerToBegin;

        // On est au 1er tour, le 1er a joué est celui après celui qui a distribué.
        if (!this.getRound().getPreviousTurn()) {
            firstPlayerToBegin = this.getNextPlayerToGiver();
        }
        else {
            // Sinon bah c'est celui qui a gagné au Turn précédent
            firstPlayerToBegin = this.getRound().getPreviousTurn().getWinner();
        }

        // Don't ask ...
        if (typeof firstPlayerToBegin !== "undefined") {
            this.addPlayerInQueue(firstPlayerToBegin);
        }

        const playersWithoutTheBeginner = store.state.players.filter(player => {
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

    determineTheWinner() : void {

        let winner : Player | null = null;

        this.getPlayersQueue().map(player => {

            if (!winner) {
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
            if (playerCurrentCard.getIndex() === 21) {
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
    pickUpCards() : void {

        const winner = this.getWinner();

        if (!winner) { return; }

        this.getRound().getAttackerPlayers().includes(winner) ?
        this.getRound().addAttackerStackCards(this.getCards()) : this.getRound().addDefenderStackCards(this.getCards());
    }

    resetPlayersCurrentCard() : void {

        if (store.state.players.length <= 0) {
            return;
        }

        store.state.players.map(player => {
            player.setCurrentCard(null);
        });
    }

    getWinner() : Player {
        return this.winner;
    }

    setWinner(player : Player | null) : void {

        if (!(player instanceof Player)) {
            return;
        }

        this.winner = player;
    }

    getPlayersQueue() : Array<Player> {
        return this.playersQueue;
    }

    addPlayerInQueue(player : Player | null) : void {

        if (!(player instanceof Player)) {
            return;
        }

        this.playersQueue.push(player);
    }

    getCards() : Array<Card> {
        return this.cards;
    }

    addCard(card : Card) : void {
        this.cards.push(card);
    }
}
