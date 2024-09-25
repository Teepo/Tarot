import { rooms } from '../../store/index.js';

import { unserialize } from './../../../utils/object';

export default function(io, socket, data, callback) {

    let { roomId, card } = data;

    const room = rooms.get(roomId);

    if (!room) {
        return;
    }
    
    const round  = room.getCurrentRound();
    const player = round.getAttackerPlayers()[0];

    round.setCalledKing(unserialize(card));

    console.log('round/setCalledKing', card.sign, card.label);

    const response = { roomId : room.id, card };

    socket.in(roomId).emit('alert', {
        str : `Player ${player.login} call ${card.value}`,
        type : 'success'
    });

    socket.in(roomIn).emit('round/setCalledKing', response);
};