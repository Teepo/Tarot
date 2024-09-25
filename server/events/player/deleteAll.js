import { rooms } from './../../store/index.js';

export default function(io, socket, data, callback) {

    rooms.toArray().map(room => {
        room.deletePlayers();
    });

    socket.broadcast.emit('deletedAllPlayers');
    socket.emit('deletedAllPlayers');
};