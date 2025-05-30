import postCollection from  "../models/postCollection.js"


const createPost = async(req,res)=>{
   try{
     const {title , files} = req.body;
    const {_id} = req.user;

    let posts = await postCollection.insertOne({
        title,
        files,
        userId:_id
    })
    res.status(201).json({msg:"post created successfully"})
   }catch(error){
    res.status(500).josn({msg:error.message})
   }
}

const deletePost = async(req,res)=>{
    res.send('deleted successfully')
}

const yourPosts = async(req,res)=>{
    try{
        const {_id} = req.user;
        let posts = await postCollection.find({userId:_id}).populate({path:'userId',select:'name profilePic'}).populate({ 
     path: 'comment',
     populate: {
       path: 'userId',
       select:'name profilePic'
     } 
  })
        res.status(200).json({posts})
    }catch(error){
     res.status(500).josn({error:error.message})
    }
}

const allPosts = async(req,res)=>{
    try {
            let posts = await postCollection.find().populate({ path: 'userId', select: 'name profilePic' }).populate({ 
     path: 'comment',
     populate: {
       path: 'userId',
       select:'name profilePic'
     } 
  })
        res.status(200).json({posts})
    }catch(error){
        res.status(500).json({error:error.message})
    }
}

const likePost = async(req,res)=>{
    try{
        const {_id} = req.user;
        const {postId} = req.params

        let post = await postCollection.findById(postId);
        if(post.likes.includes(_id)){
            post.likes.pull(_id);
            await post.save()
            res.status(200).json({msg:"post disliked successfully"})
        }
        else{
            post.likes.push(_id);
            await post.save()
            res.status(200).json({msg:"post liked successfully"})
        }
    }catch{
          res.status(500).json({ error: error.message })
    }
}

const commentPost = async (req,res)=>{
    const {_id} = req.user;
    const {postId} = req.params;
    const {text} = req.body;

    try{
        let post = await postCollection.findById(postId);
        post.comment.push({userId:_id,text:text});
        await post.save();
        res.status(200).json({msg:"comment added successfully"})

    }catch(error){
        res.status(500).json({error: error.message})
    }
}

const commentDelete = async (req,res) =>{
    const {postId} = req.params;
    const {commentId} = req.params;
const userId = req.user._id;

  try {
    const post = await postCollection.findById(postId);

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const comment = post.comment.filter((ele)=>ele._id.toString()!==commentId) //[]
    post.comment = comment;
    await post.save()

    return res.status(200).json({ msg: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ msg: 'Server error' });
  }
};

export{
    createPost,
    deletePost,
    yourPosts,
    allPosts,
    likePost,
    commentPost,
    commentDelete
}