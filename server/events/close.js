import { rooms } from './../store/index';

export default function(io, socket, data, callback) {

    const { roomId } = data;

    console.log('client disconnect', roomId);

    const room = rooms.get(roomId);

    if (!room) {
        return socket.emit('close', {
            error : new RoomNotExistError
        });
    }

    room.delete(socket);

    socket.broadcast('playerLeft');

    // Supprimer la salle si elle est vide
    if (room.size === 0) {
        this.rooms.delete(roomId);
        console.log(`room ${roomId} removed because empty`);
    }
};