'use-strict'

const Socket = require('socket.io');
const messageHandler = require('./chatModule/messageHandler');
const UserModel = require('../models/user');
module.exports = (server)=>{
    
    const pingInterval = 25 * 1000;
    const pingTimeout = 5000;
    const io = Socket(server,{
        pingInterval,
        pingTimeout
    });

    //VERIFY IF CONNECTION IS TRIGGERED FROM OUR APP
    io.use(async(socket, next)=>{
        if(socket.handshake.query){
            const token = socket.handshake.query.Authorization;
           // console.log(socket)
           
            const result = await isValidUser(token)
            console.log(result)
            if(result){
                next();
            }else{
                console.log("Invalid user")
                next(new Error('user not connected'))
            }
        }
    });

    io.on('connection', socket=>{
        console.log(`${socket.id} has connected`);

        socket.on('send_msg', async (data)=>{
            console.log(data);
            const m = await messageHandler.newMessage(data, data.senderId);
            socket.to(data.recipientId).emit('new_msg', data)
            socket.send('sent', m)

        })
        socket.on('disconnect', (data)=>{
            console.log(data)
            console.log(`this token has disconnected ${socket.handshake.query.Authorization}`)
        })

        connectedHandler(socket.handshake.query.Authorization, socket)
    });

}

/**
 * @description HANDLE  SETUP FOR CLIENT CONNECTION
 * @param {*} token user auth token
 * @param {*} socket socket instance
 */
const connectedHandler = async(token, socket)=>{
    try{
        const  user =  await  authenticateUser({token});
        await UserModel.findOneAndUpdate({_id: user._id},{connected: true,last_seen: Date.now()})
        socket.emit("socket_user_connected", {connected: true, isLastSeen: false, lastSeen: Date.now});
    }catch(ex){
        console.log(ex);
    }
    
    
}


/**
 * @description This method returns true if the user is a valid user and returns false if the user is not valid
 * @param {*} token  The logged in user toke 
 * @returns Boolean
 */
const isValidUser = async(token)=>{
   const  user =  await  authenticateUser({token});
   return user ? true : false;
}

/**
 * @description check if the token exists
 * @param {*} options  contains a property with key token
 * This is the user token\
 * @returns returns a nullable object with thee connected user _id
 */
const authenticateUser = async (options)=> {
   return UserModel.findOne({
      auth_token: options.token
    }).select('_id').lean()
}