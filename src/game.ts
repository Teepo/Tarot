import { cardList } from './config/cardList';

import { Card } from './card';
import { Round } from './round';

import store from './store';

export class Game {

    rounds : Array<Round>;

    constructor() {
        this.rounds = [];
    }

    addRound(round : Round) {
        this.rounds.push(round);
    }

    getRounds() : Array<Round> {
        return this.rounds;
    }

    /**
     * @description Retourne le dernier élément de getRounds(), donc le courant.
     *
     */
    getCurrentRound() : Round {
        return this.getRounds().slice(-1)[0];
    }

    /**
     * @description Retourne l'avant dernier élément de getRound(), donc le précédent.
     *
     */
    getPreviousRound() : Round {
        return this.getRounds().slice(-2, -1)[0];
    }

    static getKingCards() : Array<Card> {

        return Object.keys(cardList).filter(cardID => {
            return [14, 28, 42, 56].indexOf(parseInt(cardID)) >= 0;
        }).map(index => {
            return new Card(parseInt(index));
        });
    }

    static getQueenCards() : Array<Card> {

        return Object.keys(cardList).filter(cardID => {
            return [13, 27, 41, 55].indexOf(parseInt(cardID)) >= 0;
        }).map(index => {
            return new Card(parseInt(index));
        });
    }

    static getKnightCards() : Array<Card> {

        return Object.keys(cardList).filter(cardID => {
            return [12, 26, 40, 54].indexOf(parseInt(cardID)) >= 0;
        }).map(index => {
            return new Card(parseInt(index));
        });
    }

    static getJackCards() : Array<Card> {

        return Object.keys(cardList).filter(cardID => {
            return [11, 25, 39, 53].indexOf(parseInt(cardID)) >= 0;
        }).map(index => {
            return new Card(parseInt(index));
        });
    }

    /**
     * @description API qui indique si une carte a le droit d'être joué.
     *
     */
    static isOkToPlayThisCard(card : Card) : Boolean {

        const { turn } = store.state;

        const currentPlayer = store.getters.currentPlayer;

        // On est le 1er a joué. C'est nous qui décidons du signe.
        if (turn.getCards().length <= 0) {
            console.log('isOkToPlayThisCard > first');
            return true;
        }

        // C'est toujours OK de jouer l'excuse
        if (card.isExcuse()) {
            console.log('isOkToPlayThisCard > Excuse');
            return true;
        }

        const firstCard = turn.getCards().slice(0)[0];
        const lastCard  = turn.getCards().slice(-1)[0];

        // Meme signe, même combat
        if (card.getSign() === firstCard.getSign() && !firstCard.isAtout()) {
            console.log('isOkToPlayThisCard > same sign > OK');
            return true;
        }

        // Les signes sont différents.
        // S'il tente de jouer autre chose que le signe alors qu'il en a.
        if (card.getSign() !== firstCard.getSign() && currentPlayer.hasCardOfThisSignInHisDeck(firstCard.getSign())) {
            console.log('isOkToPlayThisCard > different sign > KO because has sign');
            return false;
        }

        // Les signes sont différents.
        // S'il tente de jouer autre chose que le signe alors qu'il a des atouts
        if (card.getSign() !== firstCard.getSign() && !card.isAtout() && currentPlayer.hasCardAtoutInHisCards()) {
            console.log('isOkToPlayThisCard > different sign > KO because has atout');
            return false;
        }

        if (lastCard.isAtout() && card.getValue() <= lastCard.getValue()) {

            console.log('isOkToPlayThisCard > is atout, but check if raised', !currentPlayer.hasBiggestCardComparedToPreviousCards(turn.getCards()));

            // Si la carte joué est de l'atout ainsi que la précédente
            // la carte joué doit être supérieur ( si possible )
            return !currentPlayer.hasBiggestCardComparedToPreviousCards(turn.getCards());
        }

        console.log('isOkToPlayThisCard > all good', card.getSign(), card.getLabel());

        // Donc ici soit tu as monté, soit tu pisses !
        return true;
    }

    /**
     * @description API qui indique si une liste de cartes peut être placé dans le chien.
     *
     */
    static isChienValid(cards : Array<Card>) : Boolean {

        if (cards.length !== 3) {
            return false;
        }

        if (cards.find(card => {
            return card.isBout() ||card.isKing();
        })) {
            return false;
        }

        return true;
    }
}
