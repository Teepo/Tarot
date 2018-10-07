import { cardsList } from './config/cardList';
import { gameTypeList } from './config/gameTypeList';

export class Round {

    constructor() {

        this.players         = [];
        this.attackerPlayers = [];
        this.defenderPlayers = [];

        this.attackerPoints = 0;
        this.defenderPoints = 0;

        this.playerWhoGiveCards = null;

        this.calledKing = null;

        this.gameType = undefined;
    }

    /**
     * @description En fonction du gameType déjà choisis, retourne la liste des choix restants.
     *
     * @return {object}
     */
    getAvailableGameType() {

        // Aucun type choisi, on retourne la liste complète direct.
        if (this.gameType === undefined) {
            return gameTypeList;
        }

        return Object.keys(gameTypeList).filter(type => {
            return parseInt(type) > this.gameType;
        }).reduce((obj, key) => {
            obj[key] = gameTypeList[key];
            return obj;
        }, {});
    }

    /**
     *
     * @return {String}
     */
    getGameType() {
        return this.gameType;
    }

    /**
     * @description Le type de partie choisi ( petite, garde, garde-sans, garde-contre )
     *
     * @param {int} type
     */
    setGameType(type) {

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
    setCalledKing(card) {

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
    getCalledKing() {
        return this.calledKing;
    }

    /**
     * @description En fonction du roi appellé, retourne le second attaquant ( s'il y en a réellement un ).
     *
     * @return {Player}
     */
    findPartner() {

        return this.players.find(player => {
            return player.getCards().find(card => {
                return card.index === this.getCalledKing().index;
            });
        });
    }

    /**
     *
     * @return {Player}
     */
    getPlayerWhoGiveCards() {
        return this.playerWhoGiveCards;
    }

    /**
     * @param {array<Player>} players
     *
     */
    setPlayers(players) {
        this.players = players;
    }

    /**
     * @param {Player} player
     *
     */
    setPlayerWhoGiveCards(player) {
        this.playerWhoGiveCards = player;
    }

    /**
     * @param {float} points
     *
     */
    setAttackerPoints(points) {
        this.attackerPoints = points;
    }

    /**
     * @param {float} points
     *
     */
    setDefenderPoints(points) {
        this.defenderPoints = points;
    }

    /**
     * @param {array<Player>}
     */
    getAttackerPlayers() {
        return this.attackerPlayers;
    }

    /**
     * @param {Player} player
     *
     */
    addAttackerPlayer(player) {
        this.attackerPlayers.push(player);
    }

    /**
     * @param {Player} player
     *
     */
    addDefenderPlayer(player) {
        this.defenderPlayers.push(player);
    }

    /**
     * @param {array<Player>} players
     *
     */
    setDefenderPlayers(players) {
        this.defenderPlayers = players;
    }

    /**
     * @description En fonction des attaquants, retourne les défenseurs
     *
     * @return {array<Player>} players
     */
    findDefenderPlayers() {

        return this.players.filter(p => {
            return this.getAttackerPlayers().filter(ap => {
                return !Object.is(p, ap);
            });
        });
    }

    /**
     *
     * @return {boolean}
     */
    gameTypeIsChoosen() {
        return typeof this.gameType !== 'undefined';
    }
}
