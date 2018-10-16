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
     * @return {int}
     */
    getIndex() {
        return this.index;
    }

    /**
     *
     * @return {Boolean}
     */
    isAtout() {
        return this.value.slice(0, 1) === 'A';
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

    /**
     * @description Caution, call a magical getter.
     *
     * @return {String}
     */
    getSign() {
        return this.sign;
    }

    /**
     * @getter
     *
     * @return {String}
     */
    get sign() {

        if (this.isAtout()) {
            return 'A';
        }
        else if (this.isExcuse()) {
            return 'E';
        }

        return this.value.slice(0, 1);
    }
}
