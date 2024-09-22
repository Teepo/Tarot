import { WS_PROTOCOL, WS_HOST, WS_PORT } from './../config/ws.js';

import { io } from 'socket.io-client';

import { Alert } from './../modules/alert.js';

import { unserialize } from './../utils/object.js';

export class SocketClient {
    
    constructor(url) {
        
        this.socket = io(url);

        return new Proxy(this, {
            get(target, prop) {
                // Si la propriété demandée existe sur this, la renvoyer
                if (prop in target) {
                    return target[prop];
                }
                // Sinon, la déléguer à this.socket
                if (prop in target.socket) {
                    return target.socket[prop].bind(target.socket);
                }
            }
        });
    }

    emit(eventName, data) {
        
        return new Promise((resolve, reject) => {
            
            this.socket.emit(eventName, data, response => {
                return response.error ?
                reject(unserialize(response)) : resolve(unserialize(response));
            });
        });
    }

    on(eventName, callback) {
        this.socket.on(eventName, (...args) => {
            const unserializedArgs = args.map(arg => unserialize(arg));
            callback(...unserializedArgs);
        });
    }

    disconnect() {
        this.socket.disconnect();
    }
}

export const socket = new SocketClient(`${WS_PROTOCOL}://${WS_HOST}:${WS_PORT}`);
