import { useRouter } from 'vue-router'

import { socket } from './../../modules/ws.js';

import { wsErrorHandler } from '@/modules/wsErrorHandler.js';

import router from './../../router/index';

const state = () => ({
    room : {}
});

const mutations = {

    setRoom(state, room) {
        state.room = room;
    },
};

const actions = {

    async get({ commit }, { roomId }) {
        
        try {
            
            const { room } = await socket.emit('room/get', { roomId });
        
            commit('setRoom', room);

            return room;
        }
        catch(e) {
            wsErrorHandler(e);
            return e;
        }
    },

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
    
            return { player };
        }
        catch(e) {
            wsErrorHandler(e);
            return e;
        }
    },

    leave({ commit }, { roomId, playerId }) {
        socket.emit('room/leave', { roomId, playerId });
    },

    setOwner({ commit }, { roomId, playerId }) {
        socket.emit('room/setOwner', { roomId, playerId });
    },

    initSocketListeners({ commit }) {

        socket.on('room/start', ({ playerId }) => {
            router.push({ name: 'MultiplayerGame', params: { roomId: this.roomId } });
        });
        
        socket.on('room/join', ({ player }) => {
            commit('player/add', player, { root: true });
        });

        socket.on('room/leave', ({ playerId }) => {
            commit('player/delete', playerId, { root: true });
        });
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
