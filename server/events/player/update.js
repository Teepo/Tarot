import { rooms } from './../../store/index.js';

export default function(io, socket, data, callback) {

    const { player, roomId } = data;

    const room = rooms.get(roomId);

    if (!room) {
        return;
    }

    if (!room.getPlayerById(player.id)) {
        return socket.emit('player/update', {
            error : new UserNotExistError
        });
    }

    room.updatePlayer(player.id, player);

    socket.in(roomId).emit('player/update', { player });
};