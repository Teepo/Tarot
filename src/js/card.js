import { cardsList } from './config/cardList';

export class Card {

    /**
     * @param {integer} index
     */
    constructor(index) {

        this.index = index;
        this.value = cardsList[index];
    }

    /**
     *
     * @return {Boolean}
     */
    isBout() {
        return (this.index === 1 || this.index === 21 || this.index === 22);
    }

    /**
     *
     * @return {Boolean}
     */
    isExcuse() {
        return this.index === 22;
    }
}
