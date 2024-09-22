import { rooms } from '../../store/index.js';

import { unserialize } from './../../../utils/object';

export default function(socket, data, callback) {

    let { roomId, card } = data;

    const room = rooms.get(roomId);

    if (!room) {
        return;
    }
    
    const round  = room.getCurrentRound();

    round.setCalledKing(unserialize(card));

    console.log('round/setCalledKing', card.sign, card.label);

    const response = { roomId : room.id, card };

    socket.emit('round/setCalledKing', response);
    socket.broadcast.emit('round/setCalledKing', response);
    return callback(response);
};