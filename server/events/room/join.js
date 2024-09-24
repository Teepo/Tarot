import { v4 as uuidv4 } from 'uuid';

import { rooms } from './../../store/index.js';

import { RoomNotExistError, UserAlreadyExistError } from './../../../errors/index.js';

import { Player } from './../../../models/player.ts';

export default function(socket, data, callback) {

    const { roomId, id, login } = data;

    const room = rooms.get(roomId);

    if (!room) {

        const response = {
            error : new RoomNotExistError
        };

        socket.emit('room/join', response);
        return callback(response);
    }

    const player = new Player({
        id     : id ? id : uuidv4(),
        login  : login,
        roomId : roomId,
    });

    try {

        room.addPlayer(player);

        console.log(`player ${login} join room ${room.name}`);

        const response = {
            socketId : socket.id,
            player   : player
        };

        socket.join(room.id);

        socket.in(room.id).emit('room/join', response);
        callback(response);
    }
    catch(e) {

        if (e instanceof UserAlreadyExistError) {

            const response = {
                error : new UserAlreadyExistError
            };
            
            socket.emit('room/join', response);
            callback(response);
        }
    }
};