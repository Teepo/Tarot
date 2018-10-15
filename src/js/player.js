const templatePlayerGameType   = require('./templates/modals/player_game_type.handlebars');
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

        // La Card joué pendant un tour
        this.currentCard = null;
    }

    /**
     *
     * @return {Card}
     */
    getCurrentCard() {
        return this.currentCard;
    }

    /**
     * @param {Card} card
     *
     */
    setCurrentCard(card) {
        this.currentCard = card;
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
     * @return {Card}
     */
    removeCard(index) {
        return this.getCards().splice(index, 1);
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
     * @param {Turn}  turn A été bind au préalable
     * @param {Event} event
     *
     */
    onClickCardChoiceButton(turn, event) {

        const cardId = parseInt(event.target.dataset.id);

        // 1. On check si la Card a le droit d'etre joué

        // 2. On supprime la Card du deck du joueur
        const card = this.removeCard(cardId)[0];

        // 3. On ajoute la Card dans la liste des Card du tour
        turn.addCard(card);

        // 4. On ajoute au Player la Card joué
        this.setCurrentCard(card);

        // 5. On supprime la delegation de la vue
        this.onClickCardChoiceButtonEvent.destroy();

        // 6. On supprime la modal
        document.getElementById('playerCardChoice').remove();

        // 7. On passe à la suite
        this.cardChoiceResolver(event.target.dataset.type);
    }

    /**
     * @param {Turn} turn
     *
     * @return {Promise}
     */
    askCard(turn) {

        return new Promise(resolve => {

            // 1. La function qui fera passer à la suite
            this.cardChoiceResolver = resolve;

            // 2. On stocke la delegation pour la détruite une fois la Promise résolut
            this.onClickCardChoiceButtonEvent = require('delegate')(document.body, '#playerCardChoice button', 'click', this.onClickCardChoiceButton.bind(this, turn));

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
