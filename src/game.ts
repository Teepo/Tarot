import { cardList } from './config/cardList';

import { Card } from './card';

import type { Player } from './player';
import type { Round } from './round';
import type { Turn } from './turn';

export class Game {

    players : Array<Player>;
    rounds : Array<Round>;

    currentPlayer!: Player;

    constructor() {

        this.players = [];
        this.rounds = [];
    }

    setCurrentPlayer(player : Player) {
        this.currentPlayer = player;
    }

    setPlayers(players : Array<Player>) {
        this.players = players;
    }

    getPlayers() : Array<Player> {
        return this.players;
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
            return [36, 50, 64, 78].indexOf(parseInt(cardID)) >= 0;
        }).map(index => {
            return new Card(index);
        });
    }


    /**
     * @description API qui indique si une carte a le droit d'être joué.
     *
     */
    static isOkToPlayThisCard(turn : Turn, player : Player, card : Card) : Boolean {

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
            console.log('isOkToPlayThisCard > same sign');
            return true;
        }

        // Les signes sont différents.
        // S'il tente de jouer autre chose que le signe alors qu'il en a.
        if (card.getSign() !== firstCard.getSign() && player.hasCardOfThisSignInHisDeck(firstCard.getSign())) {
            console.log('isOkToPlayThisCard > different sign');
            return false;
        }

        if (lastCard.isAtout() && card.getIndex() <= lastCard.getIndex()) {

            console.log('isOkToPlayThisCard > is atout, but check if raise or not', !player.hasCardStrongerInHisDeck(lastCard.getIndex()));
            
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
