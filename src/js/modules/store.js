export class Store {

    /**
     * @param {String} k
     * @param {String} v
     *
     */
    static set(k, v) {

        if (typeof this.data === "undefined") {
            this.data = [];
        }

        if (typeof this.data[k] === "undefined") {
            this.data[k] = [];
        }

        this.data[k] = v;
    }

    /**
     * @param  {String} k
     *
     * @return {mixed}
     */
    static get(k) {
        return typeof this.data[k] !== "undefined" ? this.data[k] : false;
    }
}
