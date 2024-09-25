import { v4 as uuidv4 } from 'uuid';

import { rooms } from './../../store/index.js';

import { RoomAlreadyExistError } from './../../../errors/index.js';

import { Room } from './../../../models/room.ts';

export default function(io, socket, data, callback) {

    const { id, roomName, settings } = data;

    if (!rooms.has(roomName)) {

        const room = new Room({
            id       : id ? id : uuidv4(),
            name     : roomName,
            settings : settings
        });

        rooms.set(room.id, room);

        console.log(`room ${roomName} created`);

        socket.join(room.id, () => {
            console.log(`socket ${socket.id} join room ${room.name}`);
        });

        if (socket.rooms.has(room.id)) {
            console.log(`Client ${socket.id} is in room ${room.id}`);
        } else {
            console.log(`Client ${socket.id} is NOT in room ${room.id}`);
        }

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