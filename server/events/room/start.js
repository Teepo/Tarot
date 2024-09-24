import { rooms } from './../../store/index.js';

import { RoomNotExistError } from './../../../errors/index.js';

import { Round } from './../../../models/round.js';

export default function(socket, data, callback) {

    console.log('room start > begin');

    const { roomId } = data;

    const room = rooms.get(roomId);

    if (!room) {

        const response = { error : new RoomNotExistError };

        socket.emit('room/start', response)
        return callback(response);
    }

    room.isStarted = true;

    const response = { room };

    console.log('room start > done');

    socket.in(roomId).emit('room/start', response);
    return callback(response);
};