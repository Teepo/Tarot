import yargs from 'yargs';

import { createServer } from 'https';
import { readFileSync } from 'fs';
import { Server } from 'socket.io';

import eventHandlers  from './events/index.js';

import { WS_PORT } from './../config/ws.js';

Map.prototype.toArray = function() {
    return Array.from(this.values());
};

export default class GameServer {

    constructor() {

        const argv = yargs(process.argv).argv;

        const isHTTPS = argv.https ?? false;

        if (isHTTPS) {

            const server = createServer({
                cert : readFileSync('./certs/cert.pem'),
                key  : readFileSync('./certs/key.pem')
            });

            server.listen(WS_PORT);

            this.ws = new Server(server, {
                cors: {
                    origin: '*',
                    credentials: true
                }
            });
        }
        else {
            this.ws = new Server(WS_PORT, {
                cors: {
                    origin: '*',
                    credentials: true
                }
            });
        }

        this.ws.on('connection', socket => {

            socket.onAny((eventName, data, callback) => {

                if (!eventHandlers[eventName]) {
                    return console.log(`Unhandled event: ${eventName}`, data);
                }

                eventHandlers[eventName](socket, data, callback);
            });
        });
    }
}
