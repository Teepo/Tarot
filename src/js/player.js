const template = require('./templates/modals/player_game_type.handlebars');

import { View } from './modules/view';

export class Player {

    constructor() {

        this.name = '';
        this.points = 0;
        this.cards = [];
        this.gameType = null;

        this.gameTypeResolver = null;
        this.onClickButtonEvent = null;
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
    onClickButton(event) {

        // 1. On supprime la delegation
        this.onClickButtonEvent.destroy();

        // 2. On passe à la suite
        this.gameTypeResolver(event.target.dataset.type);
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
            this.onClickButtonEvent = require('delegate')(document.body, '#playerChooseGameType button', 'click', this.onClickButton.bind(this));

            // 3. On render la template
            View.render(require('handlebars').compile(template)({
                player : this,
                gameTypeAvailable : round.getAvailableGameType()
            }));
        });
    }
}
