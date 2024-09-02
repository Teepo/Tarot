import { WS_PROTOCOL, WS_HOST, WS_PORT } from './../config/ws.js';

import { io } from 'socket.io-client';

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
                if (response.error) {
                    reject(response.error);
                }
                else {
                    resolve(response);
                }
            });
        });
    }

    disconnect() {
        this.socket.disconnect();
        console.log('Socket > disconnected');
    }
}

export const socket = new SocketClient(`${WS_PROTOCOL}://${WS_HOST}:${WS_PORT}`);
