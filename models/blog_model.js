import mongoose, { mongo } from "mongoose";
import { Comment } from "./comment_model.js";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
console.log(`${__filename}`);
const __dirname = path.dirname(__filename);
console.log(`directory ${__dirname}`);
const blogSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    thumbnail:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})


blogSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const blogId = this._id;
    // Delete all related comments, likes, etc.
    await Comment.deleteMany({ blogId: blogId });
    console.log(`directory ${__dirname}`);
    if (this.thumbnail) {
        const filePath = path.resolve(this.thumbnail);
        console.log(`filePath ${filePath}`);
   // Adjust based on your file storage path
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          } else {
            console.log('File deleted successfully:', this.filePath);
          }
        });
      }

    next();
  });

export const Blog = mongoose.model('Blog',blogSchema);