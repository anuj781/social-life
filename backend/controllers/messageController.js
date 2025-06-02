import conversationCollection from "../models/conversation.js";
import messageCollection from "../models/MessageCollection.js";

const sendMessage = async(req,res)=>{
    try {
        const  {_id}   = req.user;
        const {friendId} = req.params;
   const {text , files} = req.body;

   let message =await messageCollection.insertOne({
        userId:_id,
        friendId,
        text,
        files
   })

   let conversation = await conversationCollection.findOne({members:{$all:[_id,friendId]}});

   if(!conversation){
        conversation = await conversationCollection.create({members:[_id,friendId]})
   }

   conversation.messages.push(message._id)
   await conversation.save()


   res.status(201).json({msg:"message send successfully"})
  } catch (error) {
     res.status(500).json({error:error.message})
  }

 }


const getMessage = async(req,res)=>{
// res.send("get is working")
    const {_id}  = req.user;
    const {friendId} = req.params;

    let messages = await conversationCollection.findOne({members:{$all:[_id,friendId]}}).populate({path:'members'}).populate({path:'messages'})
    res.status(200).json(messages)

}


const deleteMessage = async(req,res)=>{
res.send("delete is working")
}


export {
    sendMessage,
    getMessage,
    deleteMessage
}
