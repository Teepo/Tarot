import { v4 as uuidv4 } from 'uuid';

import { rooms } from './../../store/index.js';

import { RoomAlreadyExistError } from './../../../errors/index.js';

import { Room } from './../../../models/room.ts';

export default function(socket, data, callback) {

    const { id, roomName, settings } = data;

    if (!rooms.has(roomName)) {

        const room = new Room({
            id       : id ? id : uuidv4(),
            name     : roomName,
            settings : settings
        });

        rooms.set(room.id, room);

        console.log(`room ${roomName} created`);

        socket.emit('createdRoom', { room });

        callback({ room });
    }
    else {

        const response = {
            error : new RoomAlreadyExistError
        };

        socket.emit('room/create', response);
        callback(response);
    }
};