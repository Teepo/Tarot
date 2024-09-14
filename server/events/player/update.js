import { rooms } from './../../store/index.js';

export default function(socket, data, callback) {

    const { player, roomId } = data;

    const room = rooms.get(roomId);

    if (!room) {
        return socket.emit('updatedPlayer', {
            error : new RoomNotExistError
        });
    }

    if (!room.getPlayerById(player.id)) {
        return socket.emit('updatedPlayer', {
            error : new UserNotExistError
        });
    }

    room.updatePlayer(player.id, player);

    socket.emit('updatedPlayer', {
        player : player
    });

    socket.broadcast.emit('updatedPlayer', {
        player : player
    });
};