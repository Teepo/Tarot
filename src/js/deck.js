import { Card } from './card';

export class Deck {

    constructor() {

        this.cards = [];

        for (let i = 1; i <= 78; i++) {
            this.cards.push(new Card(i));
        }
    }

    /**
     * @param {array<Card>} cards
     *
     */
    setCards(cards) {
        this.cards = cards;
    }

    /**
     * @description Retire et retourne les 3 premières cartes du deck.
     *
     * @return {array<Card>}
     */
    getThreeCard() {

        const cards = this.cards.slice(0, 3);

        cards.map(c => {
            this.cards = this.removeCardFromDeck(c);
        });

        return cards.length > 0 ? cards : false;
    }

    /**
     * @description Retire et retourne la 1ère carte du deck. ( Pour la mettre dans le chien )
     *
     * @return {Card}
     */
    getOneCard() {

        const card = this.cards.slice(0, 1)[0]; // Can throw exception

        this.cards = this.removeCardFromDeck(card);

        return card;
    }

    /**
     * @param {Card} card
     *
     * @return {array}
     */
    removeCardFromDeck(card) {
        return this.cards.filter(c => c !== card);
    }

    /**
     *
     * @return {array<Card>}
     */
    shuffle() {

        this.cards.sort(() => {
            return 0.5 - Math.random();
        });
    }
}
