import { IPlayer } from './player';

export interface ICard {

    index : number;
    sign  : string;
    label : string;
    value : number;

    player! : IPlayer;
}
