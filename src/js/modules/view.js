export class View {

    /**
     * @static
     *
     * @param {Node} node
     *
     */
    static empty(node) {
        node.innerHTML = "";
    }

    /**
     * @static
     *
     * @param {string} html
     * @param {Node}   node
     *
     */
    static render(html, node = false) {

        node = node || document.getElementById('app');

        node.insertAdjacentHTML('beforeend', html.trim());
    }
}
