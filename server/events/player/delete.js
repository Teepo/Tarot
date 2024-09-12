import { rooms } from './../../store/index.js';

export default function(socket, data, callback) {

    const { id } = data;

    rooms.toArray().map(room => {
        room.deletePlayer(id);
    });

    console.log(`player ${id} deleted from all rooms`);

    socket.broadcast.emit('deletedPlayer', {
        id : id
    });
    
    socket.emit('deletedPlayer', {
        id : id
    });
};