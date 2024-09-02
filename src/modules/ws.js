import { WS_PROTOCOL, WS_HOST, WS_PORT } from './../config/ws.js';

import { io } from 'socket.io-client';

import { Alert } from './../modules/alert.js';

export class SocketClient {
    
    constructor(url) {
        this.socket = io(url);
        this.socket.on('connect', () => {
            console.log('Socket > connected');
        });
    }

    emit(eventName, data) {
        
        return new Promise((resolve, reject) => {
            
            this.socket.emit(eventName, data, response => {
                return response.error ? reject(response.error) : resolve(response);
            });
        });
    }

    async alert(options) {
        
        await this.socket.emit('alert', options);

        Alert.add(options);
    }

    disconnect() {
        this.socket.disconnect();
        console.log('Socket > disconnected');
    }
}

export const socket = new SocketClient(`${WS_PROTOCOL}://${WS_HOST}:${WS_PORT}`);
