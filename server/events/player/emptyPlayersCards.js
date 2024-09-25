import { rooms } from './../../store/index.js';

import { RoomNotExistError } from './../../../errors/index.js';

export default function(io, socket, data, callback) {

    const { roomId, value } = data;

    const room = rooms.get(roomId);

    if (!room) {
        const response = { error : new RoomNotExistError };
        socket.emit('player/emptyPlayersCards', response);
        return callback(response);
    }

    const players = room.getPlayers();

    console.log('players > emptyPlayersCards');

    players.forEach(player => {
        player.emptyCards()
    });

    return callback({ players });
};