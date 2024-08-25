import { ICard   } from "./card";
import { IDeck   } from "./deck";
import { IPlayer } from "./player";
import { ITurn   } from "./turn";

export interface IRound {
    attackerPlayers : Array<IPlayer>;
    defenderPlayers : Array<IPlayer>;
  
    attackerStackCards : Array<ICard>;
    defenderStackCards : Array<ICard>;
  
    attackerPoints : number;
    defenderPoints : number;
  
    playersQueue: Array<IPlayer>;
  
    playerWhoGiveCards : IPlayer | null;
  
    calledKing : ICard | null;
  
    gameType: number | null;
  
    turns : Array<ITurn>;
  
    deck : IDeck;
  
    chiens : Array<ICard>;
  }