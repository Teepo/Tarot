export class View {

    /**
     * @static
     *
     * @param {string} html
     *
     */
    static render(html) {

        document.getElementById('app').innerHTML = html.trim();
    }
}
