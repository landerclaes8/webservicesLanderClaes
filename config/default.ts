export default{
  port: 9000,
    log:{
        level:'silly',
        disabled:false,
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
          expirationInterval: 60 * 60, // s (1 hour)
          secret:
            'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
        },
      
        argon: {
          hashLength: 32,
          timeCost: 6, //aantal hashing-iteraties
          memoryCost: 2 ** 17,
        },
      },    
};