const Socket = require('socket.io');

module.exports = (server)=>{
    
    const pingInterval = 25 * 1000;
    const pingTimeout = 5000;
    const io = Socket(server,{
        pingInterval,
        pingTimeout
    });

    // VERIFY IF CONNECTION IS TRIGGERED FROM OUR APP
    io.use(async(socket, next)=>{
        if(socket.handshake.query){
            const token = socket.handshake.query.Authorization;
            const result = await isValidUser(token)
            if(result){
                next(result)
            }else{
                next(new Error('user not connected'))
            }
        }
    });

    io.on('connection', socket=>{
        console.log(`${socket.id} has connected`);
    });

    
}

let isValidUser = async(token)=>{

}