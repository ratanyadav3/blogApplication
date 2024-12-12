import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({

    content:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    blogId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Blog',
        required:true
    }

},{timestamps:true})

export const Comment = mongoose.model('Comment',commentSchema);

