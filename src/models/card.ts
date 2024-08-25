import { Card as CardInterface } from './../types/card';
import { Player } from './../types/player';

import { cardList } from './../config/cardList';

export class Card implements CardInterface {

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
