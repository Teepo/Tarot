import { rooms } from './../../store/index.js';

export default function(socket, data, callback) {

    const players = Array.from(rooms.values()).map(room => {
        return room.getPlayers().toArray();
    });

    socket.emit('getAllPlayers', {
        players : players.flat()
    });
};