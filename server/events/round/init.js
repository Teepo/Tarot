import { rooms } from './../../store/index.js';

import { RoomNotExistError } from './../../../errors/index.js';

import { Round } from './../../../models/round.js';

export default function(socket, data, callback) {

    const { roomId } = data;

    const room = rooms.get(roomId);

    if (!room) {

        const response = { error : new RoomNotExistError };

        socket.emit('round/init', response)
        return callback(response);
    }

    const players = room.getPlayers();

    players.forEach(player => {
        player.emptyCards()
    });

    const round = (new Round(room.id)).init(room);
    
    room.addRound(round);

    const response = { roomId : room.id, round };

    socket.emit('round/init', response);
    socket.broadcast.emit('round/init', response);
    return callback(response);
};