export default{
  env: 'development',
      auth: {
        jwt: {
          expirationInterval: 60 * 60, // s (1 hour)
          secret:'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
        }
      },    
};