import { Player } from './player';

import { cardsList } from './config/cardList';

export class Card {

    index : number;
    value : string;

    player! : Player;

    constructor(index : number) {

        this.index = index;
        this.value = cardsList[index];
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
        return this.value.slice(0, 1) === 'A';
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

    get sign() : string {

        if (this.isAtout()) {
            return 'A';
        }
        else if (this.isExcuse()) {
            return 'E';
        }

        return this.value.slice(0, 1);
    }
}
