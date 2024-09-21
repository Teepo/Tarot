import { rooms } from '../../store/index.js';

import { RoomNotExistError } from '../../../errors/index.js';

import { Round } from '../../../models/round.js';

export default function(socket, data, callback) {

    const { roomId } = data;

    const room = rooms.get(roomId);

    if (!room) {

        const response = { error : new RoomNotExistError };

        socket.emit('round/getPlayerWhoMustGiveHisGametype', response)
        return callback(response);
    }
    
    const round  = room.getCurrentRound();

    const player = round.getCurrentPlayerIntoPlayersQueueForAskGameType();

    console.log('round/getPlayerWhoMustGiveHisGametype', player.login);

    const response = { player };

    socket.emit('round/getPlayerWhoMustGiveHisGametype', response);
    return callback(response);
};