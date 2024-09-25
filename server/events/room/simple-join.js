import { v4 as uuidv4 } from 'uuid';

import { rooms } from './../../store/index.js';

import { RoomNotExistError, UserAlreadyExistError } from './../../../errors/index.js';

import { Player } from './../../../models/player.ts';

export default function(io, socket, data, callback) {

    const { roomId, id } = data;

    const room = rooms.get(roomId);

    if (!room) {
        return;
    }

    const player = room.getPlayerById(id);

    if (!player) {
        return;
    }
    
    socket.join(room.id);
};