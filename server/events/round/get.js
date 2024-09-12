import { rooms } from './../../store/index.js';

import { RoomNotExistError } from './../../../errors/index.js';

import { Round } from './../../../models/round.js';

export default function(socket, data, callback) {

    const { roomId } = data;

    const room = rooms.get(roomId);

    if (!room) {

        const response = { error : new RoomNotExistError };

        socket.emit('round/get', response)
        return callback(response);
    }
    
    const round = room.getCurrentRound();

    const response = { round };

    socket.emit('round/get', response);
    socket.broadcast.emit('round/get', response);
    return callback(response);
};