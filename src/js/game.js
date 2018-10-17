/* @flow */

const gameBoardTemplate = require('./templates/game_board.handlebars');

import { Deck } from './deck';

import { View } from './modules/view';

import { cardsList } from './config/cardList';

import { Card } from './card';

import type { Player } from './player';
import type { Round } from './round';
import type { Turn } from './turn';

export class Game {

    players : Array<Player|any>;
    rounds : Array<Round|any>;

    deck : Deck;

    chiens : Array<Card|any>;

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
    addCardInChien() : void {

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
    setPlayers(players : Array<Player>) : void {
        this.players = players;
    }

    /**
     *
     * @return {array<Player>}
     */
    getPlayers() : Array<Player> {
        return this.players;
    }

    /**
     * @param {Round} round
     *
     */
    addRound(round : Round) : void {
        this.rounds.push(round);
    }

    /**
     * @static
     *
     * @return {array<Card>}
     */
    static getKingCards() : Array<Card> {

        return Object.keys(cardsList).filter(cardID => {
            return [36, 50, 64, 78].indexOf(parseInt(cardID)) >= 0;
        }).map(index => {
            return new Card(index);
        });
    }

    giveCardsToPlayers() : void {

        this.deck.shuffle();

        // On distribue les cartes
        let playerIndex = 0;

        let cards = [];
        while (cards = this.deck.getThreeCard()) {

            if (playerIndex >= 5) {
                playerIndex = 0;
            }

            if (!(cards instanceof Array)) {
                return;
            }

            this.players[playerIndex].addCards(cards);

            // On met eventuellement une carte dans le chien
            this.addCardInChien();

            playerIndex++;
        }
    }

    displayBoard() : void {

        const dashboard = document.getElementById('dashboard');

        if (!(dashboard instanceof HTMLElement)) {
            return;
        }

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
    static isOkToPlayThisCard(turn : Turn, player : Player, card : Card) : bool {

        // On est le 1er a joué. C'est nous qui décidons du signe.
        if (turn.getCards().length <= 0) {
            return true;
        }

        // C'est toujours OK de jouer l'excuse
        if (card.isExcuse()) {
            return true;
        }

        const firstCard = turn.getCards().slice(0)[0];
        const lastCard  = turn.getCards().slice(-1)[0];

        // Meme signe, même combat
        if (card.getSign() === firstCard.getSign() && !firstCard.isAtout()) {
            return true;
        }

        // Les signes sont différents.
        // S'il tente de jouer autre chose que le signe alors qu'il en a.
        if (card.getSign() !== firstCard.getSign() && player.hasCardOfThisSignInHisDeck(firstCard.getSign())) {
            return false;
        }

        if (lastCard.isAtout() && card.getIndex() <= lastCard.getIndex()) {

            // Si la carte joué est de l'atout ainsi que la précédente
            // la carte joué doit être supérieur ( si possible )
            return !player.hasCardStrongerInHisDeck(lastCard.getIndex());
        }

        // Donc ici soit tu as monté, soit tu pisses !
        return true;
    }
}
