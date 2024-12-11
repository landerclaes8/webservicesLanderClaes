"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    port: 9000,
    log: {
        level: 'silly',
        disabled: false,
    },
    cors: {
        origins: ['http://localhost:5173'],
        maxAge: 3 * 60 * 60,
    },
    auth: {
        maxDelay: 5000,
        jwt: {
            audience: 'webstore.hogent.be',
            issuer: 'webstore.hogent.be',
            expirationInterval: 60 * 60,
            secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
        },
        argon: {
            hashLength: 32,
            timeCost: 6,
            memoryCost: 2 ** 17,
        },
    },
};
