"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePort = void 0;
/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val) => {
    const port = parseInt(val, 10);
    if (Number.isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
};
exports.normalizePort = normalizePort;
