import { ICard } from './card';

export interface IPlayer {

    id         : string;
    login      : string;
    isReady    : Boolean;
    customData : Object;

    scores      : Array<number>;
    cards       : Array<ICard>;
    gameType    : String | null;
    currentCard : ICard | null;
}
