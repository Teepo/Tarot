const templatePlayerGameType = require('./templates/modals/player_game_type.handlebars');
const templatePlayerCardChoice = require('./templates/modals/player_card_choice.handlebars');


import { View } from './modules/view';

export class Player {

    constructor() {

        this.name = '';
        this.points = 0;
        this.cards = [];
        this.gameType = null;

        this.gameTypeResolver = null;
        this.cardChoiceResolver = null;

        this.onClickGameTypeButtonEvent = null;
        this.onClickCardChoiceButtonEvent = null;
    }

    /**
     * @param {array<Card>} cards
     *
     */
    addCards(cards) {

        cards.map(card => {
            this.cards.push(card);
        });
    }

    /**
     * @description Défausse une carte du deck d'un joueur
     *
     * @param {Number} index L'index dans le tableau de getCards()
     *
     */
    removeCard(index) {
        this.getCards().splice(index, 1);
    }

    /**
     *
     * @return {array<Card>}
     */
    getCards() {
        return this.cards;
    }

    /**
     * @param {Event} event
     *
     */
    onClickGameTypeButton(event) {

        // 1. On supprime la delegation
        this.onClickButtonEvent.destroy();

        // 2. On passe à la suite
        this.gameTypeResolver(event.target.dataset.type);
    }

    /**
     * @param {Event} event
     *
     */
    onClickCardChoiceButton(event) {

        const cardId = parseInt(event.target.dataset.id);

        this.removeCard(cardId);

        // 1. On supprime la delegation
        this.onClickCardChoiceButtonEvent.destroy();

        // 2. On passe à la suite
        this.cardChoiceResolver(event.target.dataset.type);
    }

    /**
     * @param {Round} round
     *
     * @return {Promise}
     */
    askCard() {

        return new Promise(resolve => {

            // 1. La function qui fera passer à la suite
            this.cardChoiceResolver = resolve;

            // 2. On stocke la delegation pour la détruite une fois la Promise résolut
            this.onClickCardChoiceButtonEvent = require('delegate')(document.body, '#playerCardChoice button', 'click', this.onClickCardChoiceButton.bind(this));

            // 3. On render la template
            View.render(require('handlebars').compile(templatePlayerCardChoice)({
                player : this,
                cards  : this.getCards()
            }));
        });
    }

    /**
     * @param {Round} round
     *
     * @return {Promise}
     */
    askGameType(round) {

        return new Promise(resolve => {

            // 1. La function qui fera passer à la suite
            this.gameTypeResolver = resolve;

            // 2. On stocke la delegation pour la détruite une fois la Promise résolut
            this.onClickGameTypeButtonEvent = require('delegate')(document.body, '#playerChooseGameType button', 'click', this.onClickGameTypeButton.bind(this));

            // 3. On render la template
            View.render(require('handlebars').compile(templatePlayerGameType)({
                player : this,
                gameTypeAvailable : round.getAvailableGameType()
            }));
        });
    }
}
