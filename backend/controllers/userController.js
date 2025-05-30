import userCollection from "../models/userCollection.js";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import jwt from 'jsonwebtoken'
const SECRET = 'hellohi'
import nodemailer from 'nodemailer'
import randomstring from 'randomstring'
import postCollection from '../models/postCollection.js'


const registerUser = async(req,res)=>{
try{
    
    
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(401).json({msg:"please fill all details"})
        }
        

        let existingUSer = await userCollection.findOne({email});
        if(existingUSer){
            return res.status(401).json({msg:"user already registered"})
        }
    
       
        let hashPassword = bcrypt.hashSync(password , salt)
    
        let data = await userCollection.insertOne({
            name,
            email,
            password:hashPassword
        })
    
        res.status(201).json({msg:"user registered successfully"})
    }catch{
        res.status(500).json({error:"error message"})
    }
}
const loginUser = async(req,res)=>{
    const {email , password} = req.body;
    if(!email || !password){
        return res.status(401).json({msg:"please fill all details"})
    }

    
    let user = await userCollection.findOne({email}); // {}

    if(user){
        let comparePassword = bcrypt.compareSync(password , user.password);
        if(comparePassword){            
            let token = await jwt.sign({_id:user._id}, SECRET)
            return res.status(200).json({msg:"user log in successfully", user, token})
        }
        else{
            return res.status(401).json({msg:"incorrect password"})
        }
    }
    else{
        res.status(401).json({msg:"user not found please signup"})
    }


}


const updateUser = async(req,res)=>{
   try{
    console.log("req.user=",req.user)
    const {_id} = req.user
    const {name , password , coverPic , profilePic} = req.body;
   if(password){
    var hashPassword = bcrypt.hashSync(password, salt);
   }

   let user = await userCollection.findByIdAndUpdate(_id, {name:name , password:hashPassword, coverPic , profilePic})

   res.status(200).json({msg:"user updated successfully"})
   }
   catch(error){
    res.status(500).json({msg:error.message})
   }
}

const deleteUser = async(req,res)=>{
    try{
        const {_id} = req.user
    let user = await userCollection.findByIdAndDelete(_id);
    res.status(200).json({msg:"user deleted successfully"})
    }
    catch(error){
        res.status(500).json({msg:error.message})
    }
}

const  forgetPassword = async(req,res)=>{

    try{
        const {email} = req.body;
        let user = await userCollection.findOne({email})
        if(user){
            let resetToken = randomstring.generate(50)  //fghjkl;;kjhgfyuioptrtyuiop
            user.resetPasswordToken = resetToken
            await user.save()

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                  user: "anujrana54638@gmail.com",
                  pass: "pyuo cuij ijzd wjyz",
                },
              });
              
              // Wrap in an async IIFE so we can use await.
              (async () => {
                const info = await transporter.sendMail({
                  from: 'anujrana54638@gmail.com',
                  to: email,
                  subject: "Reset password",
                  text: `please click the link below to update password \n http://localhost:6677/user/resetPassword/${resetToken}`
                
                });
              
                console.log("Message sent:", info.messageId);
              })();
              res.status(200).json({msg:"please check your email for further information"})
        }
        else{
            return res.status(401).json({msg:"user not found"})
        }
    } catch(error){
        res.status(500).json({error:error.message})
    }
}

const resetPassword  = async (req,res) =>{
    const {resetToken} = req.params
    console.log(resetToken);
    let user = await userCollection.findOne({resetPasswordToken:resetToken});
    if(user){
        res.render('passResetPage' , {resetToken})
      }
      else{
        res.status(401).json({msg:'token expired'})
      }
}

const updatePassword = async(req,res)=>{
    const {password} = req.body;
    const {resetToken } = req.params

    let user = await userCollection.findOne({resetPasswordToken:resetToken});  //{id name email password}

    if(user){
      let hashedPassword = bcrypt.hashSync(password, salt)
      user.password = hashedPassword
      user.resetPasswordToken = null
      await user.save()

      res.status(200).json({msg:"password updated successfully"})
    }
    else{
      res.status(401).json({msg:"token expired"})
    }
}

const searchFriend = async(req,res)=>{
    try{
        let {name} = req.query
        if (name.length>0){
            let users = await userCollection.find({name:new RegExp(name)})
            res.status(200).json(users)
        }
        else{
            res.status(200).json([])
        }
    } catch (error){
        res.status(500).json({error:error.message})
    }
}

const getFriend = async(req,res)=>{
    try{
        const {friendId} = req.params;
        const friend = await userCollection.findById(friendId).select('-password');
         let friendPosts  =  await postCollection.find({userId:friendId}).populate({path:"userId",select:"name profilePic"}).populate({path:"comment", populate:{path:'userId',select:'name profilePic'}});
         res.status(200).json({msg:"data fetched successfully", friend, friendPosts});
    }catch(error){
        res.status(500).json({error:error.message})
    }
} 

const followUnfollowUser = async(req,res)=>{
  try {
     const { _id } = req.user;
   const friendId = req.params.friendId;

   let user = await userCollection.findById(_id)  // your details
   let friend = await userCollection.findById(friendId)  // friend details

   if(user.followings.includes(friendId) && friend.followers.includes(_id)){
      user.followings.pull(friendId)
      friend.followers.pull(_id);
      await user.save()
      await friend.save()
      res.status(200).json({msg:"user unfollow successfully"})
   }
   else{
     user.followings.push(friendId)
      friend.followers.push(_id);
      await user.save()
      await friend.save()
      res.status(200).json({msg:"user follow successfully"})
   }
  } catch (error) {
      res.status(500).json({error:error.message})
  }
}

export  {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    forgetPassword,
    resetPassword,
    updatePassword,
    searchFriend,
    getFriend,
    followUnfollowUser
}