import { rooms } from './../../store/index.js';

import { RoomNotExistError } from './../../../errors/index.js';

export default function(io, socket, data, callback) {

    const { roomId } = data;

    const room = rooms.get(roomId);

    if (!room) {

        const response = { error : new RoomNotExistError };

        socket.emit('player/getAllFromRoom', response);
        return callback(response);
    }

    const response = room.getPlayers();

    socket.emit('player/getAllFromRoom', response);
    return callback(response);
};