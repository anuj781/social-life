import mongoose from "mongoose";

// function connectToDb(){
//     mongoose.connect('mongodb://127.0.0.1:27017/magicMedia')
//   .then(() => console.log('Mongodb Connected successfully'))
//   .catch(()=>console.log('error in mongodb'));
// }
async function connectToDb(){

try{
    await mongoose.connect('mongodb://127.0.0.1:27017/magicMedia')
    console.log('Mongodb Connected successfully');
}catch(error){
    console.log('error in mongodb');

}
}

export default connectToDb