import { IRound } from './round';
import { IPlayer } from './player';

export interface ITurn {
    round: IRound,
    playersQueue: [],
    winner: IPlayer,
    cards: [],
    currentPlayer: IPlayer,
}