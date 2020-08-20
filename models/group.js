const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: null
    },
    userId: {
        type: String,
        ref: 'users'
    },
    members: [{
        groupId: {
          type: String,
          ref: 'groups'
        },
        userId: {
          type: String,
          ref: 'users'
        },
        left: {
          type: Boolean,
          default: false
        },
        deleted: {
          type: Boolean,
          default: false
        },
        admin: {
          type: Boolean,
          default: false
        }
    }],
},{timestamps:true});

module.exports =  mongoose.model('Chat', groupSchema);