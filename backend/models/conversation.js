import mongoose from "mongoose"

const conversationSchema = new mongoose.Schema({
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        }
    ],

    messages:[
          {
            type:mongoose.Schema.Types.ObjectId,
            ref:'messages'
        }
    ]


})

const conversation = mongoose.model('conversation', conversationSchema)
export default conversation