import { rooms } from './../store/index';

export default function(socket, data, callback) {

    const { roomName } = data;

    const room = rooms.get(roomName);

    if (!room) {
        return socket.emit('stop', {
            error : new RoomNotExistError
        });
    }

    room.isStarted = false;

    room.getPlayers().toArray().map(player => {

        try {
            player.isReady = false;
        }
        catch(e) {
            console.error('Try to update ready status', p);
        }
    });

    socket.emit('stop');
    socket.broadcast.emit('stop');
};