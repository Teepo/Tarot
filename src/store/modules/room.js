import { socket } from './../../modules/ws.js';

import { wsErrorHandler } from '@/modules/wsErrorHandler.js';

const state = () => ({
    room : {}
});

const mutations = {

    setRoom(state, room) {
        state.room = room;
    },
};

const actions = {

    async create({ commit }, { roomName, settings }) {
        
        try {
            
            const { room } = await socket.emit('room/create', { roomName, settings });
        
            commit('setRoom', room);

            return room;
        }
        catch(e) {
            wsErrorHandler(e);
            return e;
        }
    },

    async join({ commit }, { id, roomId, login }) {

        try {
            
            const { player } = await socket.emit('room/join', { id, roomId, login });
    
            commit('player/add', player);

            return player;
        }
        catch(e) {
            wsErrorHandler(e);
            return e;
        }
    },

    setOwner({ commit }, { roomId, playerId }) {
        socket.emit('room/setOwner', { roomId, playerId });
    },

    initSocketListeners({ commit }) {
    },

    removeSocketListeners() {
    },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
