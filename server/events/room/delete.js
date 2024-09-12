import { rooms } from './../../store/index.js';

export default function(socket, data, callback) {

    const { roomId } = data;

    rooms.delete(roomId);

    console.log(`room ${roomId} deleted`);

    socket.broadcast.emit('deletedRoom', {
        roomId : roomId
    });
    
    socket.emit('deletedRoom', {
        roomId : roomId
    });
};