import { rooms } from './../../store/index.js';

export default function(io, socket, data, callback) {

    const players = Array.from(rooms.values()).map(room => {
        return room.getPlayers();
    });

    socket.emit('player/getAll', {
        players : players.flat()
    });
};