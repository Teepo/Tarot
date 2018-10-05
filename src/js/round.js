import { gameTypeList } from './config/gameTypeList';

export class Round {

    constructor() {

        this.deadPlayers = [];
        this.attackerPlayers = [];
        this.defenderPlayers = [];

        this.attackerPoints = 0;
        this.defenderPoints = 0;

        this.gameType = undefined;
    }

    /**
     * @description Retourne la liste des choix de game type restant
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

        if (!isRegularType) {
            throw new Error('[ROUND] setGameType() > type must be an integer');
        }

        this.gameType = type;
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
     * @param {array<Player>} players
     *
     */
    setDeadPlayers(players) {

        this.deadPlayers = players;
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
     *
     * @return {boolean}
     */
    gameTypeIsChoosen() {
        return typeof this.gameType !== 'undefined';
    }
}
