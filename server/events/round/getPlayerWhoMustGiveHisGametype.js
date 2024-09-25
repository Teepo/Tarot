import { rooms } from '../../store/index.js';

import { RoomNotExistError } from '../../../errors/index.js';

import { Round } from '../../../models/round.js';

export default async function(io, socket, data, callback) {

    const { roomId } = data;

    const room = rooms.get(roomId);

    if (!room) {

        const response = { error : new RoomNotExistError };

        socket.emit('round/getPlayerWhoMustGiveHisGametype', response)
        return callback(response);
    }
    
    const round  = room.getCurrentRound();

    const player = round.getCurrentPlayerIntoPlayersQueueForAskGameType();

    if (!player || player.isCPU) {

        console.log('round/getPlayerWhoMustGiveHisGametype, no player or player is cpu');

        if (round.gameTypeIsChoosen()) {
            console.log('round/getPlayerWhoMustGiveHisGametype, game type is choosen', room.id);
            io.to(room.id).emit('round/gameTypeIsChoosenAndEveryoneHasSpoke', { roomId : room.id });
            return;
        }
        
        return;
    }

    console.log('round/getPlayerWhoMustGiveHisGametype', player.login);

    const response = { player };

    socket.emit('round/getPlayerWhoMustGiveHisGametype', response);
    return callback(response);
};