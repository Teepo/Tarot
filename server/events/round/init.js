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

    const round = new Round(room);

    room.addRound(round);

    round.init(room);

    const player = round.getNextPlayerIntoPlayersQueueForAskGameType();
    socket.broadcast.emit('round/askGameType', { playerId : player.id });

    console.log('round init > ask game type to ', player.login);

    socket.broadcast.emit('round/init', { roomId : room.id, round });
};