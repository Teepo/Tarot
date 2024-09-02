import Noty from 'noty';

class AlertManager {

    /**
     * @param {String} str
     * @param {String} type
     * @param {Player} player
     *
     */
    add({ str, type = 'info', player }) {

        if (player) {
            str = `<img src="assets/img/balls/${player.customData.ball}" width="32"> ${str}`;
        }

        (new Noty({
            theme     : 'metroui',
            type      : type,
            text      : str,
            layout    : 'topLeft',
            closeWith : ['click', 'button'],
            timeout   : 3000
        })).show();

        return this;
    }
}

export const Alert = new AlertManager;