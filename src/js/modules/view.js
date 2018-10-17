/* @flow */

export class View {

    /**
     * @static
     *
     * @param {Node} node
     *
     */
    static empty(node : HTMLElement) : void {

        if (!(node instanceof HTMLElement)) {
            return;
        }

        node.innerHTML = "";
    }

    /**
     * @static
     *
     * @param {string} html
     * @param {Node}   node
     *
     */
    static render(html : string, node : ?HTMLElement | bool = false) : void{

        node = node || document.getElementById('app');

        if (!(node instanceof HTMLElement)) {
            return;
        }

        node.insertAdjacentHTML('beforeend', html.trim());
    }
}
