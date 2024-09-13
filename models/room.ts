import { UserAlreadyExistError } from './../errors/index.js';

import { Player } from './player';
import { Round } from './round';

export class Room {

    #players;
    
    rounds : Array<Round>;

    id       : number;
    name     : string;
    settings : Object;

    isStarted : boolean;
    owner: Player | null;

    constructor({ id, name, settings }: { id: number, name: string, settings: Object }) {
	    
        this.id        = id;
        this.name      = name;
        this.isStarted = false;
        
        this.#players  = new Map;

        this.owner     = null

	    this.settings  = settings;

        this.rounds = [];
    }

    addPlayer(player: Player) {

        if (this.#players.toArray().find(p => p.login === player.login)) {
            throw new UserAlreadyExistError;
        }

        this.#players.set(player.id, player);
    }

    getPlayers() {
        return this.#players;
    }

    getPlayerById(id: number) {
        return this.#players.get(id);
    }

    updatePlayer(id: number, player: Player) {
        this.#players.set(id, player);
    }

    deletePlayer(id: number) {
        this.#players.delete(id);
    }

    deletePlayers() {
        this.#players.clear()
    }

    getSettings() {
	    return this.settings;
    }

    setOwner(player: Player) {
        this.owner = player;
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
}