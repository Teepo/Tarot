import { socket } from './../../modules/ws.js';

console.log(socket)

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
        
        const { room } = await socket.emit('room/create', { roomName, settings });
        
        commit('setRoom', room);
    },

    async join({ commit }, { id, roomId, login }) {
        
        const { player } = await socket.emit('room/join', { id, roomId, login });
    
        commit('player/add', player);
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
