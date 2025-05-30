import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title:{
        type:String
    },
    files:[],
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }
},{timestamps:true})

postSchema.add({
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        }
    ],
    comment:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'users'
            },
            
                text:{
                    type:String
                }
            
        }
    ]
})

const posts = mongoose.model('posts',postSchema);
export default posts