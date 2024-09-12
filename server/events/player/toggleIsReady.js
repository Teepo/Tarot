import { rooms } from './../../store/index.js';

import { RoomNotExistError } from './../../../errors/index.js';

export default function(socket, data, callback) {

    const { playerId, roomId, value } = data;

    const room = rooms.get(roomId);

    if (!room) {
        const response = { error : new RoomNotExistError };
        socket.emit('player/toggleIsReady', response);
        return callback(response);
    }

    const player = room.getPlayerById(playerId);

    try {
        player.isReady = value ?? !player.isReady;
    }
    catch(e) {
        console.error('Try to update ready status', player);
    }

    const response = { player };

    socket.emit('player/toggleIsReady', response);
    socket.broadcast.emit('player/toggleIsReady', response);
    return callback(response);
};