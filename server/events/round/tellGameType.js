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

        socket.in(roomId).emit('round/set', { round });
        socket.in(roomId).emit('round/setGameType', { type });
    }
    else {

        console.log('tellGameType', player.login, 'pass');

        socket.in(roomId).emit('alert', {
            str : `Player ${player.login} pass`,
            type : 'warning'
        });
    }

    round.getNextPlayerIntoPlayersQueueForAskGameType();

    let p = round.getCurrentPlayerIntoPlayersQueueForAskGameType();

    if (!p || p.isCPU) {

        if (round.gameTypeIsChoosen()) {

            round.emptyPlayersQueueForAskGameType();

            console.log('tellGameType > all players spoke, and game type is choosen');

            socket.in(roomId).emit('round/set', { round });
            socket.in(roomId).emit('round/gameTypeIsChoosenAndEveryoneHasSpoke', { roomId : room.id });
            return;
        }

        console.log('tellGameType > all players pass > restart');
        
        round.init(room);

        p = round.getCurrentPlayerIntoPlayersQueueForAskGameType();

        socket.in(roomId).emit('round/set', { round });
        socket.in(roomId).emit('player/refresh', { players : room.getPlayers() });

        socket.broadcast.emit('alert', {
            str : `Everyone pass, restart !`,
            type : 'warning'
        });
    }

    console.log('tellGameType > next player to give his game type', p.login);

    const response = { round, player : p };

    socket.in(roomId).emit('round/tellToPlayerToGiveHisGameType', response);
    return callback(response);
};