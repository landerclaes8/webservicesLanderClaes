export default{
  env: 'testing',
  log:{
    level:'silly',
    disabled:true,
},
        auth: {
          maxDelay: 0,
        
        jwt: {
          expirationInterval: 60 * 60, // s (1 hour)
          secret:
            'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
        }, 

      },
};