import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    //sender
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    //reciver
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    //text
    text:{
      type:String
    },
    //image is a string kyuki cloudinary mko string dega
    image:{
        type:String
    }
},{timestamps:true});

 const Message=mongoose.model("Message",messageSchema);
 export default Message;