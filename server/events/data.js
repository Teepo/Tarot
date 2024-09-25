import { rooms } from './../store/index';

export default function(io, socket, data, callback) {

    const { id, roomId, eventType } = data;

    const room = rooms.get(roomId);

    if (!room) {
        return callback({ error : new RoomNotExistError });
    }

    const player = room.getPlayerById(id);

    if (!player) {
        return callback({ error : new UserNotExistError });
    }

    socket.in(roomId).emit(eventType, data);

    callback(data);
};