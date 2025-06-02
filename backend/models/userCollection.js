import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
    name:{
        type:String,
        minLength:2,
        maxLength:100,
        required:true
    },

    email: {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})

userSchema.add({
    resetPasswordToken:{
        type:String,
        default:null
    },
     profilePic:{
        type:String,
          default:"https://img.freepik.com/vecteurs-premium/icones-utilisateur-comprend-icones-utilisateur-symboles-icones-personnes-elements-conception-graphique-qualite-superieure_981536-526.jpg?semt=ais_items_boosted&w=740https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgsaRe2zqH_BBicvUorUseeTaE4kxPL2FmOQ&s"
    },

    coverPic:{
        type:String,
        default:"https://wallpapercave.com/wp/wp2657869.jpg"
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        }
    ],
      followings:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        }
    ]
})

const users = mongoose.model('users',userSchema);
export default users