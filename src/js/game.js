/* @flow */

const gameBoardTemplate = require('./templates/game_board.handlebars');

import { View } from './modules/view';

import { cardsList } from './config/cardList';

import { Card } from './card';

import type { Player } from './player';
import type { Round } from './round';
import type { Turn } from './turn';

export class Game {

    players : Array<Player|any>;
    rounds : Array<Round|any>;

    constructor() {

        this.players = [];
        this.rounds = [];
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
     *
     * @return {array<Round>}
     */
    getRounds() : Array<Round> {
        return this.rounds;
    }

    /**
     * @description Retourne le dernier élément de getRounds(), donc le courant.
     *
     * @return {Round}
     */
    getCurrentRound() : Round {
        return this.getRounds().slice(-1)[0];
    }

    /**
     * @description Retourne l'avant dernier élément de getRound(), donc le précédent.
     *
     * @return {Round}
     */
    getPreviousRound() : Round {
        return this.getRounds().slice(-2, -1)[0];
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

    /**
     * @description API qui indique si une liste de cartes peut être placé dans le chien.
     *
     * @param {array<Card>} cards
     *
     * @return {Boolean}
     */
    static isChienValid(cards : Array<Card>) : bool {

        if (cards.length !== 3) {
            return false;
        }

        if (cards.find(card => {
            return card.isBout();
        })) {
            return false;
        }

        return true;
    }
}
