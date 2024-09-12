import { game, rooms, round } from './../../store/index.js';

import { RoomNotExistError } from './../../../errors/index.js';

import { Round } from './../../../models/round.js';

export default function(socket, data, callback) {

    const { roomId } = data;

    const room = rooms.get(roomId);

    if (!room) {

        const response = { error : new RoomNotExistError };

        socket.emit('room/start', response)
        return callback(response);
    }

    room.isStarted = true;

    const response = { room };

    socket.emit('room/start', response);
    socket.broadcast.emit('room/start', response);
    return callback(response);
};