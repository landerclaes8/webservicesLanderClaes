export default{
    log:{
        level:'info',
        disabled:false,
    },
    cors: {
        origins: ['http://localhost:5173'], //link naar front-end
        maxAge: 3 * 60 * 60,
      },
};