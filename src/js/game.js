/* @flow */

const delegate = require('delegate');

const handlebars = require('handlebars');

const gameBoardTemplate = require('./templates/game_board.handlebars');
const scoreBoardTemplate = require('./templates/modals/score_board.handlebars');

import { View } from './modules/view';

import { cardsList } from './config/cardList';

import { Card } from './card';

import type { Player } from './player';
import type { Round } from './round';
import type { Turn } from './turn';

export class Game {

    players : Array<Player|any>;
    rounds : Array<Round|any>;

    scoreBoardResolver : Function;

    onClickScoreBoardButtonEvent : Function;

    constructor() {

        this.players = [];
        this.rounds = [];

        this.scoreBoardResolver = () => {};
        this.onClickScoreBoardButtonEvent = () => {};
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
            handlebars.compile(gameBoardTemplate)({
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

    /**
     * @param {Event} event
     *
     */
    onClickScoreBoardButton(event : Event) : void {

        const target : EventTarget = event.target;

        if (!(target instanceof HTMLElement)) {
            return;
        }

        // 1. On supprime la modal
        const scoreBoardModal = document.getElementById('scoreboard');
        if (scoreBoardModal) {
            scoreBoardModal.remove();
        }

        // 3. On supprime la delegation
        this.onClickScoreBoardButtonEvent.destroy();

        // 4. On passe à la suite
        this.scoreBoardResolver();
    }

    /**
     * @TODO Afficher le total
     *
     * @return {Promise}
     */
    displayScoreBoard() : Promise<*> {

        return new Promise(resolve => {

            // 1. La function qui fera passer à la suite
            this.scoreBoardResolver = resolve;

            // 2. On stocke la delegation pour la détruite une fois la Promise résolut
            this.onClickScoreBoardButtonEvent = delegate(document.body, '#scoreboard button', 'click', this.onClickScoreBoardButton.bind(this));

            // 3. On render la template
            View.render(handlebars.compile(scoreBoardTemplate)({
                players : this.getPlayers()
            }));

            // On skin ici les scores parce qu'avec handlebars c'est un peu chaud ...
            // Pareil pour le total ...
            document.querySelectorAll('#scoreboard  tr').forEach(tr => {

                let total = 0;
                tr.querySelectorAll('td').forEach(td => {
                    let value = parseInt(td.innerText);
                    !Number.isNaN(value) && (total += parseInt(td.innerText));
                });

                let td = document.createElement('td');
                         td.classList.add('alert', 'font-weight-bold');
                         td.innerText = total;
                tr.appendChild(td);
            });

            document.querySelectorAll('#scoreboard .alert').forEach(node => {
                node.classList.add(`alert-${parseInt(node.innerText) >= 0 ? 'success' : 'danger'}`);
            });
        });
    }
}
