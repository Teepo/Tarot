import { rooms } from './../../store/index.js';

export default function(io, socket, data, callback) {

    const { roomId } = data;

    rooms.delete(roomId);

    console.log(`room ${roomId} deleted`);

    socket.in(roomId).emit('deletedRoom', {
        roomId : roomId
    });
};