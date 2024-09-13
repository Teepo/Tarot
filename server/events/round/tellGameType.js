import { rooms } from './../../store/index.js';

import { RoomNotExistError, UserNotExistError } from './../../../errors/index.js';

import { Round } from './../../../models/round.js';

import { gameTypeList } from './../../../config/gameTypeList.js';

export default function(socket, data, callback) {

    const { roomId, playerId, type } = data;

    const room = rooms.get(roomId);

    if (!room) {

        const response = { error : new RoomNotExistError };

        socket.emit('round/tellGameType', response)
        return callback(response);
    }
    
    const round  = room.getCurrentRound();
    const player = room.getPlayerById(playerId);

    if (!player) {
        return;
    }

    // Si le joueur ne passe pas, on ajoute le joueur à la liste des attaquants
    if (type) {

        console.log('tellGameType', player.login, gameTypeList[type]);
                            
        round.setGameType(parseInt(type));
        round.resetAttackerPlayers();
        round.addAttackerPlayer(player);

        socket.broadcast.emit('alert', {
            str : `Player ${player.login} take ${gameTypeList[type]}`,
            type : 'success'
        });
    }
    else {

        console.log('tellGameType ', player.login, 'p ass');

        socket.broadcast.emit('alert', {
            str : `Player ${player.login} pass`,
            type : 'warning'
        });
    }

    let p = round.getNextPlayerIntoPlayersQueueForAskGameType();

    // Tous les joueurs on passé
    // On recrée un round
    if (!p) {

        console.log('tellGameType > all players pass > restart');
        
        round.init(room);

        p = round.getNextPlayerIntoPlayersQueueForAskGameType();

        return;
    }

    socket.broadcast.emit('round/askGameType', { playerId : p.id });
};