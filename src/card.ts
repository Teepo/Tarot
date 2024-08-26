import { Player } from './player';

import { cardList } from './config/cardList';

export class Card {

    index : number;
    sign  : string;
    label : string;
    value : number;

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

    getValue() : number {
        return this.value;
    }

    getLabel() : string {
        return this.label;
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

    isQueen() : Boolean {
        return (this.index === 13 || this.index === 27 || this.index === 41 || this.index === 55);
    }

    isKnight() : Boolean {
        return (this.index === 12 || this.index === 26 || this.index === 40 || this.index === 54);
    }

    isJack() : Boolean {
        return (this.index === 11 || this.index === 25 || this.index === 39 || this.index === 53);
    }

    isFigure() : Boolean {
        return this.isKing() || this.isQueen() || this.isKnight() || this.isJack();
    }

    isBout() : Boolean {
        return (this.index === 57 || this.index === 77 || this.index === 78);
    }

    isPetit() : Boolean {
        return this.isBout() && this.label === '1';
    }

    isExcuse() : Boolean {
        return this.index === 78;
    }

    getSign() : string {
        return this.sign;
    }
}
