/* @flow */

const templatePlayerGameType   = require('./templates/modals/player_game_type.handlebars');
const templateCalledKing       = require('./templates/modals/called_king.handlebars');
const templatePlayerCardChoice = require('./templates/modals/player_card_choice.handlebars');

import { View } from './modules/view';

import { Game } from './game';

import type { Round } from './round.js';
import type { Turn } from './turn.js';
import type { Card } from './card';

export class Player {

    name     : string;
    points   : number;
    cards    : Array<Card>;
    gameType : ?string;
    currentCard : ?Card;

    gameTypeResolver   : Function;
    calledKingResolver : Function;
    cardChoiceResolver : Function;

    onClickGameTypeButtonEvent   : Function;
    onClickCalledKingButtonEvent : Function;
    onClickCardChoiceButtonEvent : Function;

    constructor() {

        this.name = '';
        this.points = 0;
        this.cards = [];
        this.gameType;

        this.gameTypeResolver   = () => {};
        this.calledKingResolver = () => {};
        this.cardChoiceResolver = () => {};

        this.onClickGameTypeButtonEvent   = () => {};
        this.onClickCalledKingButtonEvent = () => {};
        this.onClickCardChoiceButtonEvent = () => {};

        // La Card joué pendant un tour
        this.currentCard = null;
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

        const type = target.dataset.type;

        // 2. Si le joueur ne passe pas, on l'ajoute le joueur à la liste des attaquants
        if (type) {
            round.resetAttackerPlayers();
            round.addAttackerPlayer(this);
        }

        // 3. On supprime la delegation
        this.onClickGameTypeButtonEvent.destroy();

        // 4. On passe à la suite
        this.gameTypeResolver(type);
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
        this.calledKingResolver();
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
            this.onClickCardChoiceButtonEvent = require('delegate')(document.body, '#playerCardChoice button', 'click', this.onClickCardChoiceButton.bind(this, turn));

            // 3. On render la template
            View.render(require('handlebars').compile(templatePlayerCardChoice)({
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
            this.onClickCalledKingButtonEvent = require('delegate')(document.body, '#chooseCalledKing button', 'click', this.onClickCalledKingButton.bind(this, round));

            // 3. On render la template
            View.render(require('handlebars').compile(templateCalledKing)({
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
            this.onClickGameTypeButtonEvent = require('delegate')(document.body, '#playerChooseGameType button', 'click', this.onClickGameTypeButton.bind(this, round));

            // 3. On render la template
            View.render(require('handlebars').compile(templatePlayerGameType)({
                player : this,
                gameTypeAvailable : round.getAvailableGameType()
            }));
        });
    }
}
