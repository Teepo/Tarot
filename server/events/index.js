const eventHandlers = {
    
    'data': (io, socket, data, callback) => import('./data.js').then(module => module.default(io, socket, data, callback)),
    'close': (io, socket, data, callback) => import('./close.js').then(module => module.default(io, socket, data, callback)),
   
    'room/start': (io, socket, data, callback) => import('./room/start.js').then(module => module.default(io, socket, data, callback)),
    'room/join': (io, socket, data, callback) => import('./room/join.js').then(module => module.default(io, socket, data, callback)),
    'room/simple-join': (io, socket, data, callback) => import('./room/simple-join.js').then(module => module.default(io, socket, data, callback)),
    'room/leave': (io, socket, data, callback) => import('./room/leave.js').then(module => module.default(io, socket, data, callback)),
    'room/create': (io, socket, data, callback) => import('./room/create.js').then(module => module.default(io, socket, data, callback)),
    'room/get': (io, socket, data, callback) => import('./room/get.js').then(module => module.default(io, socket, data, callback)),
    'room/delete': (io, socket, data, callback) => import('./room/delete.js').then(module => module.default(io, socket, data, callback)),
    'room/setOwner': (io, socket, data, callback) => import('./room/setOwner.js').then(module => module.default(io, socket, data, callback)),
    
    'player/get': (io, socket, data, callback) => import('./player/get.js').then(module => module.default(io, socket, data, callback)),
    'player/getAll': (io, socket, data, callback) => import('./player/getAll.js').then(module => module.default(io, socket, data, callback)),
    'player/getAllFromRoom': (io, socket, data, callback) => import('./player/getAllFromRoom.js').then(module => module.default(io, socket, data, callback)),
    'player/toggleIsReady': (io, socket, data, callback) => import('./player/toggleIsReady.js').then(module => module.default(io, socket, data, callback)),
    'player/update': (io, socket, data, callback) => import('./player/update.js').then(module => module.default(io, socket, data, callback)),
    'player/delete': (io, socket, data, callback) => import('./player/delete.js').then(module => module.default(io, socket, data, callback)),

    'room/add': (io, socket, data, callback) => import('./round/add.js').then(module => module.default(io, socket, data, callback)),

    'round/init': (io, socket, data, callback) => import('./round/init.js').then(module => module.default(io, socket, data, callback)),
    'round/get': (io, socket, data, callback) => import('./round/get.js').then(module => module.default(io, socket, data, callback)),
    'round/tellGameType': (io, socket, data, callback) => import('./round/tellGameType.js').then(module => module.default(io, socket, data, callback)),
    'round/getPlayerWhoMustGiveHisGametype': (io, socket, data, callback) => import('./round/getPlayerWhoMustGiveHisGametype.js').then(module => module.default(io, socket, data, callback)),
    'round/setCalledKing': (io, socket, data, callback) => import('./round/setCalledKing.js').then(module => module.default(io, socket, data, callback)),
};

export default eventHandlers;