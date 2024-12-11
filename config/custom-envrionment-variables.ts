export default{
    env: 'NODE_ENV', //uit logging.ts
    port: 'PORT',
    auth: {
        jwt: {
            secret: 'AUTH_JWT_SECRET',
        },
    },
};