import { Player } from './player';

import { cardList } from './config/cardList';

export class Card {

    index : number;
    sign  : string;
    label : string;
    value : string;

    player! : Player;

    constructor(index : number) {

        const { sign, label, value } = cardList[index];

        this.index = index;
        this.sign  = sign;
        this.label = label;
        this.value = value;
    }

    getIndex() : number {
        return this.index;
    }

    getValue() : string {
        return this.value;
    }

    getPlayer() : Player {
        return this.player;
    }

    setPlayer(player : Player) {
        this.player = player;
    }

    isAtout() : Boolean {
        return this.sign === 'A';
    }

    isKing() : Boolean {
        return (this.index === 14 || this.index === 28 || this.index === 42 || this.index === 56);
    }

    isBout() : Boolean {
        return (this.index === 57 || this.index === 77 || this.index === 78);
    }

    isExcuse() : Boolean {
        return this.index === 78;
    }

    getSign() : string {
        return this.sign;
    }
}
