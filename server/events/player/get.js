import { rooms } from './../../store/index.js';

import { UserNotExistError, RoomNotExistError } from './../../../errors/index.js';

export default function(io, socket, data, callback) {

    const { playerId, roomId } = data;

    const room = rooms.get(roomId);

    if (!room) {

        const response = { error : new RoomNotExistError };

        socket.emit('player/get', response);
        return callback(response);
    }

    const player = room.getPlayerById(playerId);

    if (!player) {

        const response = { error : new UserNotExistError };

        socket.emit('player/get', response);
        return callback(response);
    }

    const response = { player };

    socket.emit('player/get', response);
    callback(response);
};