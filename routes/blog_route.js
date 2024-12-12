import {Blog as blogModel} from '../models/blog_model.js'
import upload from '../config/multer.js';
import Router from 'express'
import mongoose from 'mongoose';
import {Comment as commentModel} from '../models/comment_model.js'

const router = Router();

router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{user:req.user});
})

router.post('/add-new',upload.single('thumbnail'),async(req,res)=>{

    const {title,body} = req.body;
    const coverImagePath = req.file ? `/uploads/${req.user._id}/${req.file.filename}` : null;
    const userBlog = await blogModel.create({
        title,
        body,
        thumbnail:coverImagePath,
        createdBy:req.user._id
    })
    return res.redirect('/');
})


router.get('/add-new/:_id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
        return res.status(400).render('404', { message: 'Invalid blog ID' });
    }

    try {
        const blog = await blogModel.findById(req.params._id).populate('createdBy');
        const comments = await commentModel.find({blogId:req.params._id}).populate('createdBy');
        if (!blog) {
            return res.status(404).render('404', { message: 'Blog not found' });
        }

        return res.render('showBlog', { blog, user: req.user,comments });
    } catch (err) {
        console.error(err);
        return res.status(500).render('error', { message: 'Error retrieving blog' });
    }
});

router.post('/comment/:blogId', async (req, res) => {
    const { blogId } = req.params;
    const { text } = req.body; // Ensure the comment text is sent with the key `text`.

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).send('Invalid blog ID');
    }

    try {
        // Create the comment
        const createComment = await commentModel.create({
            content: text,
            blogId,
            createdBy: req.user._id, 
        });

        console.log(`Created comment: ${createComment}`);
        return res.redirect(`/blog/add-new/${blogId}`); // Redirect to the blog page
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error adding comment");
    }
});


router.get('/delete/:id', async (req, res) => {
    try {
      const blogId = req.params.id;
  
      // Find the blog by ID
      const blog = await blogModel.findById(blogId);
      if (!blog) {
        return res.status(404).send('Blog not found');
      }
  
      // Delete the blog (triggers cascade deletion in middleware)
      await blog.deleteOne();
  
      // Optionally, send a success response
      res.redirect('/'); // Redirect to the homepage or any other route
    } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

export {router};