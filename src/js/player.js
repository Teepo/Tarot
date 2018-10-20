/* @flow */

const delegate = require('delegate');

const handlebars = require('handlebars');

const templatePlayerGameType   = require('./templates/modals/player_game_type.handlebars');
const templateCalledKing       = require('./templates/modals/called_king.handlebars');
const templatePlayerCardChoice = require('./templates/modals/player_card_choice.handlebars');
const templatePlayerChienChoice = require('./templates/modals/player_chien_choice.handlebars');

import { View } from './modules/view';

import { Game } from './game';
import { Card } from './card';

import type { Round } from './round.js';
import type { Turn } from './turn.js';

export class Player {

    name     : string;
    points   : number;
    cards    : Array<Card>;
    gameType : ?string;
    currentCard : ?Card;

    gameTypeResolver   : Function;
    calledKingResolver : Function;
    cardChoiceResolver : Function;
    chienChoiceResolver : Function;

    onClickGameTypeButtonEvent        : Function;
    onClickCalledKingButtonEvent      : Function;
    onClickCardChoiceButtonEvent      : Function;
    onClickChienCardChoiceButtonEvent : Function;
    onClickChienValidateButtonEvent   : Function;

    constructor() {

        this.name = '';
        this.points = 0;
        this.cards = [];
        this.gameType;

        this.gameTypeResolver    = () => {};
        this.calledKingResolver  = () => {};
        this.cardChoiceResolver  = () => {};
        this.chienChoiceResolver = () => {};

        this.onClickGameTypeButtonEvent        = () => {};
        this.onClickCalledKingButtonEvent      = () => {};
        this.onClickCardChoiceButtonEvent      = () => {};
        this.onClickChienCardChoiceButtonEvent = () => {};
        this.onClickChienValidateButtonEvent   = () => {};

        // La Card joué pendant un tour
        this.currentCard = null;
    }

    /**
     *
     * @return {int}
     */
    getPoints() : number {
        return this.points;
    }

    /**
     * @param {int} points
     *
     */
    updatePoints(points : number) : void {
        this.points += points;
    }

    /**
     *
     * @return {Card}
     */
    getCurrentCard() : ?Card {
        return this.currentCard;
    }

    /**
     * @param {Card} card
     *
     */
    setCurrentCard(card: ?Card) : void {
        this.currentCard = card;
    }

    /**
     * @param {array<Card>} cards
     *
     */
    addCards(cards : Array<Card>) : void {

        cards.map(card => {
            this.cards.push(card);
        });
    }

    /**
     * @param {array<Card>} cards
     *
     */
    setCards(cards : Array<Card>) : void {
        this.cards = cards;
    }

    /**
     * @description Défausse une carte du deck d'un joueur
     *
     * @param {Number} index L'index dans le tableau de getCards()
     *
     * @return {array}
     */
    removeCard(index : number) : Array<any> {
        return this.getCards().splice(index, 1);
    }

    /**
     *
     * @return {array<Card>}
     */
    getCards() : Array<Card> {
        return this.cards;
    }

    /**
     * @param {String} sign
     *
     * @return {Boolean}
     */
    hasCardOfThisSignInHisDeck(sign : string) : bool {

        return this.getCards().filter(card => {
            return card.getSign() === sign;
        }).length > 0;
    }

    /**
     * @param {int} index L'index d'une carte
     *
     * @return {Boolean}
     */
    hasCardStrongerInHisDeck(index : number) : bool {

        return this.getCards().filter(card => {
            return card.isAtout() && card.getIndex() >= index;
        }).length > 0;
    }

    /**
     * @param {Round} round
     * @param {Event} event
     *
     */
    onClickGameTypeButton(round : Round, event : Event) : void {

        const target : EventTarget = event.target;

        if (!(target instanceof HTMLElement)) {
            return;
        }

        // 1. On supprime la modal
        const playerChooseGameTypeModal = document.getElementById('playerChooseGameType');
        if (playerChooseGameTypeModal) {
            playerChooseGameTypeModal.remove();
        }

        // 3. On supprime la delegation
        this.onClickGameTypeButtonEvent.destroy();

        // 4. On passe à la suite
        this.gameTypeResolver(target.dataset.type);
    }

    /**
     * @param {Turn}  round
     * @param {Event} event
     *
     */
    onClickCalledKingButton(round : Round, event : Event) : void {

        const target : EventTarget = event.target;

        if (!(target instanceof HTMLElement)) {
            return;
        }

        // 1. On supprime la modal
        const calledKingModal = document.getElementById('chooseCalledKing');
        if (calledKingModal) {
            calledKingModal.remove();
        }

        // 2. On supprime la delegation de la vue
        this.onClickCalledKingButtonEvent.destroy();

        // 7. On passe à la suite
        this.calledKingResolver(new Card(parseInt(target.dataset.id)));
    }

    /**
     * @param {Round} round  A été bind au préalable
     * @param {Event} event
     *
     */
    onClickChienCardChoiceButton(round : Round, event : Event) : void {

        const target : EventTarget = event.target;

        if (!(target instanceof HTMLElement)) {
            return;
        }

        const parentNode = target.parentNode;

        if (!(parentNode instanceof HTMLElement)) {
            return;
        }

        const chiensNode = document.getElementById('chiens');
        const cardsNode = document.getElementById('cards');

        if (!(chiensNode instanceof HTMLElement)) {
            return;
        }
        if (!(cardsNode instanceof HTMLElement)) {
            return;
        }

        if (parentNode.id === "chiens") {
            cardsNode.appendChild(target);
        }
        else if (parentNode.id === "cards") {
            chiensNode.appendChild(target);
        }
    }

    /**
     * @param {Round} round  A été bind au préalable
     * @param {Event} event
     *
     */
    onClickChienChoiceValidateButton(round : Round, event : Event) : void {

        const target : EventTarget = event.target;

        if (!(target instanceof HTMLElement)) {
            return;
        }

        const destroy = () => {

            // On supprime la delegation de la vue
            this.onClickChienCardChoiceButtonEvent.destroy();
            this.onClickChienValidateButtonEvent.destroy();

            // On supprime la modal
            const playerChienChoiceModal = document.getElementById('playerChienChoice');
            if (playerChienChoiceModal) {
                playerChienChoiceModal.remove();
            }
        };


        // On vérifie que le chien est valide
        const chiens = Array.prototype.slice.call(document.querySelectorAll('#chiens button')).map(node => {
            return new Card(parseInt(node.dataset.id));
        });

        const cards = Array.prototype.slice.call(document.querySelectorAll('#cards button')).map(node => {
            return new Card(parseInt(node.dataset.id));
        });

        if (!Game.isChienValid(chiens)) {
            destroy()
            this.askChien(round, true);
            return;
        }

        // On passe à la suite
        this.chienChoiceResolver({
            cards  : cards,
            chiens : chiens
        });

        destroy();
    }

    /**
     * @param {Turn}  turn  A été bind au préalable
     * @param {Event} event
     *
     */
    onClickCardChoiceButton(turn : Turn, event : Event) : void {

        const target : EventTarget = event.target;

        if (!(target instanceof HTMLElement)) {
            return;
        }

        const cardId = parseInt(target.dataset.id);

        // 1. On supprime la modal
        const playerCardChoiceModal = document.getElementById('playerCardChoice');
        if (playerCardChoiceModal) {
            playerCardChoiceModal.remove();
        }

        // 2. On supprime la delegation de la vue
        this.onClickCardChoiceButtonEvent.destroy();

        // 3. On check si la Card a le droit d'etre joué
        /*
        if (!Game.isOkToPlayThisCard(turn, this, this.getCards().slice(cardId, cardId+1)[0])) {

            this.askCard(turn, true);
            return;
        }
        */

        // 4. On supprime la Card du deck du joueur
        const card = this.removeCard(cardId)[0];

        // 5. On ajoute la Card dans la liste des Card du tour
        turn.addCard(card);

        // 6. On ajoute au Player la Card joué
        this.setCurrentCard(card);

        // 7. On passe à la suite
        this.cardChoiceResolver(target.dataset.type);
    }

    /**
     * @param {Round}   round
     * @param {Boolean} hasError
     *
     * @return {Promise}
     */
    askChien(round : Round, hasError : bool = false) : Promise<*> {

        return new Promise(resolve => {

            // 1. La function qui fera passer à la suite
            //    En cas d'erreur, on se change pas le précédent resolver
            !hasError && (this.chienChoiceResolver = resolve);

            // 2. On stocke la delegation pour la détruite une fois la Promise résolut
            this.onClickChienCardChoiceButtonEvent = delegate(document.body, '#playerChienChoice .btn-light', 'click', this.onClickChienCardChoiceButton.bind(this, round));
            this.onClickChienValidateButtonEvent = delegate(document.body, '#playerChienChoice .btn-primary', 'click', this.onClickChienChoiceValidateButton.bind(this, round));

            const template = handlebars.compile(templatePlayerChienChoice)({
                player   : this,
                cards    : this.getCards(),
                chiens   : round.getChiens(),
                hasError : hasError
            });

            // 3. On render la template
            View.render(template);
        });
    }

    /**
     * @param {Turn}    turn
     * @param {Boolean} hasError
     *
     * @return {Promise}
     */
    askCard(turn : Turn, hasError : bool = false) : Promise<*> {

        return new Promise(resolve => {

            // 1. La function qui fera passer à la suite
            //    En cas d'erreur, on se change pas le précédent resolver
            !hasError && (this.cardChoiceResolver = resolve);

            // 2. On stocke la delegation pour la détruite une fois la Promise résolut
            this.onClickCardChoiceButtonEvent = delegate(document.body, '#playerCardChoice button', 'click', this.onClickCardChoiceButton.bind(this, turn));

            // 3. On render la template
            View.render(handlebars.compile(templatePlayerCardChoice)({
                player   : this,
                cards    : this.getCards(),
                hasError : hasError
            }));
        });
    }

    /**
     * @param {Round} round
     *
     * @return {Promise}
     */
    askCalledKing(round : Round) : Promise<*> {

        return new Promise(resolve => {

            // 1. La function qui fera passer à la suite
            this.calledKingResolver = resolve;

            // 2. On stocke la delegation pour la détruite une fois la Promise résolut
            this.onClickCalledKingButtonEvent = delegate(document.body, '#chooseCalledKing button', 'click', this.onClickCalledKingButton.bind(this, round));

            // 3. On render la template
            View.render(handlebars.compile(templateCalledKing)({
                player : this,
                cards  : Game.getKingCards()
            }));
        });
    }

    /**
     * @param {Round} round
     *
     * @return {Promise}
     */
    askGameType(round : Round) : Promise<*> {

        return new Promise(resolve => {

            // 1. La function qui fera passer à la suite
            this.gameTypeResolver = resolve;

            // 2. On stocke la delegation pour la détruite une fois la Promise résolut
            this.onClickGameTypeButtonEvent = delegate(document.body, '#playerChooseGameType button', 'click', this.onClickGameTypeButton.bind(this, round));

            // 3. On render la template
            View.render(handlebars.compile(templatePlayerGameType)({
                player : this,
                gameTypeAvailable : round.getAvailableGameType()
            }));
        });
    }
}
