import { rooms } from './../../store/index.js';

import { RoomNotExistError } from './../../../errors/index.js';

export default function(socket, data, callback) {

    const { playerId, roomId } = data;

    const room = rooms.get(roomId);

    if (!room) {
        return socket.emit('room/leave', {
            error : new RoomNotExistError
        });
    }

    room.deletePlayer(playerId);

    console.log(`player ${playerId} leave room ${roomName}`);

    const response = { playerId };

    socket.broadcast.emit('room/leave', response);
    socket.emit('room/leave', response);
};