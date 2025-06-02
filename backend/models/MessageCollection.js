import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    friendId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    text:{
        type:String
    },
    files:[]
})


const message = mongoose.model('messages' , messageSchema)
export default message