import { rooms } from './../../store/index.js';

import { RoomNotExistError } from './../../../errors/index.js';

import { Player } from './../../../models/player.ts';
import { Round } from './../../../models/round.ts';

export default function(socket, data, callback) {
    
    console.log('round init > begin');

    const { roomId } = data;

    const room = rooms.get(roomId);

    if (!room) {

        const response = { error : new RoomNotExistError };

        socket.emit('round/init', response)
        return callback(response);
    }

    let players = room.getPlayers();

    players.forEach(player => {
        player.emptyCards()
    });

    const round = new Round(room);

    room.addRound(round);

    round.setPlayers(players);

    // Si pas assez de joueurs, on complète avec des CPU
    if (players.length < 5) {

        const player2 = new Player({ id : 2, login : 'CPU 1', isCPU : true });
        const player3 = new Player({ id : 3, login : 'CPU 2', isCPU : true });
        const player4 = new Player({ id : 4, login : 'CPU 3', isCPU : true });
        const player5 = new Player({ id : 5, login : 'CPU 4', isCPU : true });

        const cpuPlayers = [player2, player3, player4, player5];
        
        players.push(...cpuPlayers.slice(players.length-1, 5));

        let i = 0;
        players = players.map(p => {
            
            if (!p.isCPU) {
                return p;
            }

            p.login = `CPU ${++i}`;

            return p;
        });

        round.setPlayers(players);
    }

    round.init(room);

    console.log('round init > done');

    const player = round.getNextPlayerIntoPlayersQueueForAskGameType();
    socket.broadcast.emit('round/askGameType', { playerId : player.id });

    console.log('round init > ask game type to ', player.login);

    return callback({ roomId : room.id, round });
};