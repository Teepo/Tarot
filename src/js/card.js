/* @flow */

import { cardsList } from './config/cardList';

export class Card {

    index : number;
    value : string;

    /**
     * @param {integer} index
     */
    constructor(index : number) {

        this.index = index;
        this.value = cardsList[index];
    }

    /**
     *
     * @return {int}
     */
    getIndex() : number {
        return this.index;
    }

    /**
     *
     * @return {String}
     */
    getValue() : string {
        return this.value;
    }

    /**
     *
     * @return {Boolean}
     */
    isAtout() : bool {
        return this.value.slice(0, 1) === 'A';
    }

    /**
     *
     * @return {Boolean}
     */
    isBout() : bool {
        return (this.index === 1 || this.index === 21 || this.index === 22);
    }

    /**
     *
     * @return {Boolean}
     */
    isExcuse() : bool {
        return this.index === 22;
    }

    /**
     * @description Caution, call a magical getter.
     *
     * @return {String}
     */
    getSign() : string {
        return this.sign;
    }

    /**
     * @getter
     *
     * @return {String}
     */
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
