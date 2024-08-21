import { Turn } from './turn';
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

    pickRandomValidCardInHisDeck(turn: Turn) : Card {

        const previousCards = turn.getCards();

        // Aucune carte n'a encore été joué dans ce tour.
        // On peut jouer ce qu'on veut.
        if (previousCards.length <= 0) {

        }
    }

    getWeakestPossibleCard(sign : string, lastPlayedCard : Card) : Card {

        // Étape 1 : Trouver l'objet avec le bon sign et la valeur la plus basse au-dessus de x
        const cardsWithGoodSign = this.getCards().filter(card => card.sign === sign && card.value > lastPlayedCard.value);
        if (cardsWithGoodSign.length > 0) {
            return cardsWithGoodSign.reduce((lowest, card) => card.value < lowest.value ? card : lowest);
        }

        // Étape 2 : Si aucun, chercher les cartes avec le sign 'A' au-dessus de x
        const lowestPossibleCardAtout = this.getCards().filter(card => card.sign === 'A' && card.value > lastPlayedCard.value);
        if (lowestPossibleCardAtout.length > 0) {
            return lowestPossibleCardAtout.reduce((lowest, card) => card.value < lowest.value ? card : lowest);
        }

        // Étape 3 : Si aucun, chercher les cartes avec le sign 'A' sans condition sur x
        const lowestCardAtout = this.getCards().filter(card => card.sign === 'A');
        if (lowestCardAtout.length > 0) {
            return lowestCardAtout.reduce((lowest, card) => card.value < lowest.value ? card : lowest);
        }

        // Étape 4 : Si aucun, prendre la carte la plus faible parmi toutes
        return this.getCards().reduce((lowest, card) => card.value < lowest.value ? card : lowest);
    }
}
