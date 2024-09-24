const eventHandlers = {
    
    'data': (socket, data, callback) => import('./data.js').then(module => module.default(socket, data, callback)),
    'close': (socket, data, callback) => import('./close.js').then(module => module.default(socket, data, callback)),
   
    'room/start': (socket, data, callback) => import('./room/start.js').then(module => module.default(socket, data, callback)),
    'room/join': (socket, data, callback) => import('./room/join.js').then(module => module.default(socket, data, callback)),
    'room/leave': (socket, data, callback) => import('./room/leave.js').then(module => module.default(socket, data, callback)),
    'room/create': (socket, data, callback) => import('./room/create.js').then(module => module.default(socket, data, callback)),
    'room/get': (socket, data, callback) => import('./room/get.js').then(module => module.default(socket, data, callback)),
    'room/delete': (socket, data, callback) => import('./room/delete.js').then(module => module.default(socket, data, callback)),
    'room/setOwner': (socket, data, callback) => import('./room/setOwner.js').then(module => module.default(socket, data, callback)),
    
    'player/get': (socket, data, callback) => import('./player/get.js').then(module => module.default(socket, data, callback)),
    'player/getAll': (socket, data, callback) => import('./player/getAll.js').then(module => module.default(socket, data, callback)),
    'player/getAllFromRoom': (socket, data, callback) => import('./player/getAllFromRoom.js').then(module => module.default(socket, data, callback)),
    'player/toggleIsReady': (socket, data, callback) => import('./player/toggleIsReady.js').then(module => module.default(socket, data, callback)),
    'player/update': (socket, data, callback) => import('./player/update.js').then(module => module.default(socket, data, callback)),
    'player/delete': (socket, data, callback) => import('./player/delete.js').then(module => module.default(socket, data, callback)),

    'room/add': (socket, data, callback) => import('./round/add.js').then(module => module.default(socket, data, callback)),

    'round/init': (socket, data, callback) => import('./round/init.js').then(module => module.default(socket, data, callback)),
    'round/get': (socket, data, callback) => import('./round/get.js').then(module => module.default(socket, data, callback)),
    'round/tellGameType': (socket, data, callback) => import('./round/tellGameType.js').then(module => module.default(socket, data, callback)),
    'round/getPlayerWhoMustGiveHisGametype': (socket, data, callback) => import('./round/getPlayerWhoMustGiveHisGametype.js').then(module => module.default(socket, data, callback)),
    'round/setCalledKing': (socket, data, callback) => import('./round/setCalledKing.js').then(module => module.default(socket, data, callback)),
};

export default eventHandlers;