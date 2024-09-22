import { rooms } from '../../store/index.js';

import { RoomNotExistError, UserNotExistError } from '../../../errors/index.js';

import { Round } from '../../../models/round.js';

import { gameTypeList } from '../../../config/gameTypeList.js';

export default function(socket, data, callback) {

    const { roomId, playerId, type } = data;

    const room = rooms.get(roomId);

    if (!room) {
        return;
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

        return;
    }

    console.log('tellGameType', player.login, 'pass');

    socket.broadcast.emit('alert', {
        str : `Player ${player.login} pass`,
        type : 'warning'
    });

    round.getNextPlayerIntoPlayersQueueForAskGameType();

    let p = round.getCurrentPlayerIntoPlayersQueueForAskGameType();

    // Tous les joueurs on passé
    // On recrée un round
    if (!p || p.isCPU) {

        console.log('tellGameType > all players pass > restart');

        socket.broadcast.emit('alert', {
            str : `Everyone pass, restart !`,
            type : 'warning'
        });
        
        round.init(room);

        p = round.getCurrentPlayerIntoPlayersQueueForAskGameType();

        console.log('new player to give his game type after restart', p.login);
    }

    console.log('tellGameType next player to give his game type', p.login);

    const response = { player : p };

    socket.broadcast.emit('round/tellToPlayerToGiveHisGameType', response);
    socket.emit('round/tellToPlayerToGiveHisGameType', response);
    return callback(response);
};