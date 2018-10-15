const gameBoardTemplate = require('./templates/game_board.handlebars');

import { Deck } from './deck';

import { View } from './modules/view';

export class Game {

    constructor() {

        this.players = [];
        this.rounds = [];

        this.deck = new Deck;

        this.chiens = [];
    }

    /**
     * @description Ajoute de manière aléatoire une carte dans le chien.
     *              Dans une limite de 3 cartes.
     */
    addCardInChien() {

        if (this.chiens.length >= 3) {
            return;
        }

        // @TODO
        // Techniquement, avec ce fonctionnement on peut se retrouver
        // à la fin de la distribution avec un chien avec un nombre
        // insuffisant de carte.

        // On ajoute une probabilité de ne pas rajouter une carte
        if (Math.floor(Math.random() * Math.floor(26)) > 13) {
            return;
        }

        this.chiens.push(this.deck.getOneCard());
    }

    /**
     * @param {array<Player>} players
     *
     */
    setPlayers(players) {
        this.players = players;
    }

    /**
     *
     * @return {array<Player>}
     */
    getPlayers() {
        return this.players;
    }

    /**
     * @param {Round} round
     *
     */
    addRound(round) {
        this.rounds.push(round);
    }

    giveCardsToPlayers() {

        this.deck.shuffle();

        // On distribue les cartes
        let playerIndex = 0;

        let cards = [];
        while (cards = this.deck.getThreeCard()) {

            if (playerIndex >= 5) {
                playerIndex = 0;
            }

            this.players[playerIndex].addCards(cards);

            // On met eventuellement une carte dans le chien
            this.addCardInChien();

            playerIndex++;
        }
    }

    displayBoard() {

        const dashboard = document.getElementById('dashboard');

        View.empty(dashboard);

        View.render(
            require('handlebars').compile(gameBoardTemplate)({
                players : this.players
            }),
            dashboard
        );
    }

    /**
     * @description API qui indique si une carte a le droit d'être joué.
     *
     * @param {Turn}   turn
     * @param {Player} player
     * @param {Card}   card
     *
     * @return {Boolean}
     */
    static isOkToPlayThisCard(turn, player, card) {

        // On est le 1er a joué. C'est nous qui décidons du signe.
        if (turn.getCards().length <= 0) {
            return true;
        }

        if (card.isExcuse()) {
            return true;
        }

        const firstCard = turn.getCards().slice(0)[0];
        const lastCard  = turn.getCards().slice(-1)[0];

        // Meme signe, même combat
        if (card.getSign() === firstCard.getSign()) {
            return true;
        }

        // Les signes sont différents.
        // S'il tente de jouer autre chose que le signe alors qu'il en a.
        if (player.hasCardOfThisSignInHisDeck(firstCard.getSign())) {
            console.log('try to play atout with sign in deck');
            return false;
        }

        if (lastCard.isAtout() && card.getindex() <= lastCard.getindex()) {

            console.log('atout pas assez fort');

            // Si la carte joué est de l'atout ainsi que la précédente
            // la carte joué doit être supérieur ( si possible )
            return false;
        }

        console.log('pisse !');

        // Donc ca veut dire que tu pisses sale !
        return true;
    }
}
