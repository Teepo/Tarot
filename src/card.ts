import { cardList } from './config/cardList';

export class Card {

    index  : number;
    sign   : string;
    label  : string;
    value  : number;
    points : number;

    playerId! : number;

    active: Boolean = false;

    constructor(index : number) {

        const { sign, label, value, points } = cardList[index];

        this.index  = index;
        this.sign   = sign;
        this.label  = label;
        this.value  = value;
        this.points = points;
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

    getSign() : string {
        return this.sign;
    }

    getPoints() : number {
        return this.points;
    }

    getPlayerId() : number {
        return this.playerId;
    }

    setPlayerId(playerId : number) {
        this.playerId = playerId;
    }

    isAtout() : Boolean {
        return this.sign === 'A';
    }

    isKing() : Boolean {
        return (this.getIndex() === 14 || this.getIndex() === 28 || this.getIndex() === 42 || this.getIndex() === 56);
    }

    isQueen() : Boolean {
        return (this.getIndex() === 13 || this.getIndex() === 27 || this.getIndex() === 41 || this.getIndex() === 55);
    }

    isKnight() : Boolean {
        return (this.getIndex() === 12 || this.getIndex() === 26 || this.getIndex() === 40 || this.getIndex() === 54);
    }

    isJack() : Boolean {
        return (this.getIndex() === 11 || this.getIndex() === 25 || this.getIndex() === 39 || this.getIndex() === 53);
    }

    isFigure() : Boolean {
        return this.isKing() || this.isQueen() || this.isKnight() || this.isJack();
    }

    isBout() : Boolean {
        return (this.getIndex() === 57 || this.getIndex() === 77 || this.getIndex() === 78);
    }

    isPetit() : Boolean {
        return this.isBout() && this.getSign() === 'A' && this.getLabel() === '1';
    }

    isExcuse() : Boolean {
        return this.isBout() && this.getSign() === 'A' && this.getLabel() === 'E';
    }

    is21() : Boolean {
        return this.isBout() && this.getSign() === 'A' && this.getLabel() === '21';
    }

    setActive(active : Boolean) {
        this.active = active;
    }

    isActive() : Boolean {
        return this.active;
    }
}
