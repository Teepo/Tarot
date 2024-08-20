import { Card } from './card';

export class Player {

    id         : string;
    login      : string;
    isReady    : Boolean;
    customData : Object;

    scores       : Array<number>;
    cards        : Array<Card>;
    gameType     : String | null;
    currentCard! : Card;

    constructor({ id, login }: { id: string, login: string }) {

        this.id      = id;
        this.login   = login;
        this.isReady = true;

        this.scores = [];
        this.cards  = [];
        this.gameType = null;

        this.customData = {
            avatar : ''
        };
    }

    getId() : string {
        return this.id;
    }

    addScore(points : number) : void {
        this.scores.push(points);
    }

    getScores() : Array<number> {
        return this.scores;
    }

    getTotalScore() : number {

        return this.scores.reduce((x, score) => {
            return x += score;
        });
    }

    increaseLastScore(points : number) {
        this.scores[this.scores.length -1] += points;
    }

    getCurrentCard() : Card | null {
        return this.currentCard;
    }

    setCurrentCard(card: Card | null) {
        this.currentCard = card;
    }

    addCards(cards : Array<Card>) {

        cards.map(card => {
            this.cards.push(card);
        });
    }

    setCards(cards : Array<Card>) {
        this.cards = cards;
    }

    /**
     * @description Défausse une carte du deck d'un joueur
     *
     * @param {Number} index L'index dans le tableau de getCards()
     *
     */
    removeCard(index : number) : Array<Card> {
        return this.getCards().splice(index, 1);
    }

    getCards() : Array<Card> {
        return this.cards;
    }

    hasCardOfThisSignInHisDeck(sign : string) : Boolean {

        return this.getCards().filter(card => {
            return card.getSign() === sign;
        }).length > 0;
    }

    /**
     * @param {int} index L'index d'une carte
     *
     */
    hasCardStrongerInHisDeck(index : Number) : Boolean {

        return this.getCards().filter(card => {
            return card.isAtout() && card.getIndex() >= index;
        }).length > 0;
    }
}
