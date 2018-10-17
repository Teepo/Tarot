/* @flow */

import { cardsList    } from './config/cardList';
import { gameTypeList } from './config/gameTypeList';
import { pointByCard  } from './config/pointByCard';

import { Player } from './player';
import { Card } from './card';
import type { Turn } from './turn';

export class Round {

    players         : Array<Player>;
    attackerPlayers : Array<Player>;
    defenderPlayers : Array<Player>;

    attackerStackCards : Array<Card>;
    defenderStackCards : Array<Card>;

    attackerPoints : number;
    defenderPoints : number;

    playerWhoGiveCards : ?Player;

    calledKing : ?Card;

    gameType : ?number;

    turns : Array<Turn>;

    constructor() {

        this.players         = [];
        this.attackerPlayers = [];
        this.defenderPlayers = [];

        this.attackerStackCards = [];
        this.defenderStackCards = [];

        this.attackerPoints = 0;
        this.defenderPoints = 0;

        this.playerWhoGiveCards = null;

        this.calledKing = null;

        this.gameType;

        this.turns = [];
    }

    /**
     * @param {Turn} turn
     */
    addTurn(turn : Turn) : void {
        this.turns.push(turn);
    }

    /**
     *
     * @return {array<Turn>}
     */
    getTurns() : Array<Turn> {
        return this.turns;
    }

    /**
     * @description Retourne le dernier élément de getTurns(), donc le courant.
     *
     * @return {Turn}
     */
    getCurrentTurn() : Turn {
        return this.getTurns().slice(-1)[0];
    }

    /**
     * @description Retourne l'avant dernier élément de getTurns(), donc le précédent.
     *
     * @return {Turn}
     */
    getPreviousTurn() : Turn {
        return this.getTurns().slice(-2, -1)[0];
    }

    /**
     *
     * @return {Boolean}
     */
    isFinished() : bool {
        return this.getTurns().length >= 15;
    }

    /**
     * @description En fonction du gameType déjà choisis, retourne la liste des choix restants.
     *
     * @return {object}
     */
    getAvailableGameType() : Object {

        const gameType = this.gameType;

        // Aucun type choisi, on retourne la liste complète direct.
        if (!gameType) {
            return gameTypeList;
        }

        return Object.keys(gameTypeList).filter(type => {
            return parseInt(type) > gameType;
        }).reduce((obj, key) => {
            obj[key] = gameTypeList[key];
            return obj;
        }, {});
    }

    /**
     * @description Le type de partie choisi ( petite, garde, garde-sans, garde-contre )
     *
     * @param {int} type
     */
    setGameType(type : number) : void{

        const isRegularType = !!Object.keys(gameTypeList).find(a => {
            return parseInt(a) === type;
        });

        // Type de jeu non présent dans la configuration
        if (!isRegularType) {
            throw new Error('[ROUND] setGameType() > type must be an integer');
        }

        this.gameType = type;
    }

    /**
     * @param {Card} card
     *
     */
    setCalledKing(card : Card) : void {

        const isRegularCard = Object.keys(cardsList).find(a => {
            return parseInt(a) === card.index;
        });

        // Carte non présente dans la configuration
        if (!isRegularCard) {
            throw new Error('[ROUND] setCalledKing() > Invalid card');
        }

        if ([36, 50, 64, 78].indexOf(card.index) < 0) {
            throw new Error('[ROUND] setCalledKing() > Invalid card, this is not a king');
        }

        this.calledKing = card;
    }

    /**
     *
     * @return {Card}
     */
    getCalledKing() : ?Card {
        return this.calledKing;
    }

    /**
     * @description En fonction du roi appellé, retourne le second attaquant ( s'il y en a réellement un ).
     *
     * @return {Player}
     */
    findPartnerByCards() : Player | bool {

        const partner = this.players.find(player => {
            return player.getCards().find(card => {

                let calledKing = this.getCalledKing();

                if (!(calledKing instanceof Card)) {
                    return false;
                }

                return card.index === calledKing.index;
            });
        });

        if (!(partner instanceof Player)) {
            return false;
        }

        // Si la partner trouvé est soi même, on ne retourne rien.
        if (this.getAttackerPlayers().includes(partner)) {
            return false;
        }

        return partner;
    }

    /**
     *
     * @return {array<Player>}
     */
    getPlayers() : Array<Player> {
        return this.players;
    }

    /**
     *
     * @return {Player}
     */
    getPlayerWhoGiveCards() : ?Player {
        return this.playerWhoGiveCards;
    }

    /**
     * @param {array<Player>} players
     *
     */
    setPlayers(players : Array<Player>) : void {
        this.players = players;
    }

    /**
     * @param {Player} player
     *
     */
    setPlayerWhoGiveCards(player : Player) : void  {
        this.playerWhoGiveCards = player;
    }

    /**
     * @param {float} points
     *
     */
    setAttackerPoints(points : number) : void {
        this.attackerPoints = points;
    }

    /**
     * @param {float} points
     *
     */
    setDefenderPoints(points : number) : void {
        this.defenderPoints = points;
    }

    setPoints() : void {

        this.getAttackerStackCards().map(card => {
            this.attackerPoints += pointByCard[card.getValue()];
        });

        this.getDefenderStackCards().map(card => {
            this.defenderPoints += pointByCard[card.getValue()];
        });
    }

    /**
     *
     * @return {array<Card>}
     */
    getAttackerStackCards() : Array<Card> {
        return this.attackerStackCards;
    }

    /**
     *
     * @return {array<Card>}
     */
    getDefenderStackCards() : Array<Card> {
        return this.defenderStackCards;
    }

    /**
     * @param {array<Card>} cards
     *
     */
    addAttackerStackCards(cards : Array<Card>) {

        cards.map(card => {
            this.attackerStackCards.push(card);
        });
    }

    /**
     * @param {array<Card>} cards
     *
     */
    addDefenderStackCards(cards : Array<Card>) {

        cards.map(card => {
            this.defenderStackCards.push(card);
        });
    }

    /**
     * @param {array<Player>}
     */
    getAttackerPlayers() : Array<Player> {
        return this.attackerPlayers;
    }

    /**
     * @param {array<Player>}
     */
    getDefenderPlayers() : Array<Player> {
        return this.defenderPlayers;
    }

    /**
     * @param {Player} player
     *
     */
    addAttackerPlayer(player : Player | bool = false) : void {

        // L'attaquant est seul ! Bonne chance petit !
        if (!(player instanceof Player)) {
            return;
        }

        this.attackerPlayers.push(player);
    }

    /**
     * @param {Player} player
     *
     */
    addDefenderPlayer(player : Player) : void {
        this.defenderPlayers.push(player);
    }

    /**
     * @param {array<Player>} players
     *
     */
    setDefenderPlayers(players : Array<Player>) : void {
        this.defenderPlayers = players;
    }

    /**
     * @description En fonction des attaquants, retourne les défenseurs
     *
     * @return {array<Player>} players
     */
    findDefenderPlayers() : Array<Player> {

        return this.getPlayers().filter(player => {
            return this.getAttackerPlayers().filter(aplayer => {
                return Object.is(player, aplayer);
            }).length <= 0;
        });
    }

    /**
     *
     * @return {boolean}
     */
    gameTypeIsChoosen() : bool {
        return typeof this.gameType !== 'undefined';
    }


    determineTheWinner() {
    }
}
