import { rooms } from '../../store/index.js';

export default function(socket, data, callback) {

    const { roomId, card } = data;

    const room = rooms.get(roomId);

    if (!room) {
        return;
    }
    
    const round  = room.getCurrentRound();

    round.setCalledKing(card);

    console.log('round/setCalledKing', card.sign, card.label);

    const response = { roomId : room.id, card };

    socket.emit('round/setCalledKing', response);
    return callback(response);
};