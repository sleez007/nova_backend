const ChatModel = require('../../models/chat');

exports.newMessage = async(data, userId)=>{
    if(data.is_group){
       //handle group business logic here
    }else{
        //TODO prevent on from chating with themselves
        let message = {
            sender: userId,
            recipient: data.recipientId
        }
        if(!data.message && !data.file ){
            //throw an error
        }else{
            message.message = data.message;
            message.sent = [data.data.recipientId]
            if (data.created)message.created = data.created;
            if (data.file) message.file = data.file;
            if (data.file_type)message.file_type = data.file_type;
            if (data.file_size) message.file_size = data.file_size;
            if (data.duration_file) message.duration_file = data.duration_file;
            if (data.state)  message.state = data.state;
            if (data.longitude) message.longitude = data.longitude;
            if (data.latitude) message.latitude = data.latitude;
            if (data.reply_id) message.reply_id = data.reply_id;
            if (data.reply_message !=null) message.reply_message = data.reply_message;
            if (data.document_type) message.document_type = data.document_type;
            if (data.document_name)  message.document_name = data.document_name;

            const resp =  await ChatModel.findOne({$and:[{users: data.recipientId},{users:  userId}]}).select("messages");
            if(resp){
                resp.messages.push(message);
                const newMsg = await resp.save()
                //EMIT FIREBASE EVENT
                // eventAction.emit('notification', {
                //     userId: options.user._id,
                //     from: 'chats',
                //     message: options.body.message
                //   });
                return {
                    success: true,
                    message: 'The message is sent successfully.',
                    messageId: newMsg.messages[newMsg.messages.length - 1]._id,
                }
            }else{
                let chatModel = new ChatModel({
                    users : [ userId, data.recipientId],
                    messages : message
                })
                const newMsg  = chatModel.save();
                 //EMIT FIREBASE EVENT
                // eventAction.emit('notification', {
                //     userId: options.user._id,
                //     from: 'chats',
                //     message: options.body.message
                //   });
                return {
                    success: true,
                    message: 'The message is sent successfully.',
                    messageId: newMsg.messages[newMsg.messages.length - 1]._id,
                }
            }

            
        }
        

    }
}