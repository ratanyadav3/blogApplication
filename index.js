import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import express, { urlencoded } from 'express';
import connectDB from './db/index.js';
import { router as userRoute } from './routes/user_route.js';
import {router as blogRouter} from './routes/blog_route.js';
import cookieParser from 'cookie-parser';
import isLoggedIn from './middlewares/authentication.js';
import {Blog as allBlogs} from './models/blog_model.js'

const app = express();
connectDB();

app.use( express.static(path.join('public/images/')));
app.use(urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');


app.use('/user',userRoute);
app.use('/blog',isLoggedIn,blogRouter)


app.get('/',isLoggedIn,async(req,res)=>{
    const addedBlog = await allBlogs.find({}).populate('createdBy');
    res.render('home',
        {
            user:req.user,
            blogs:addedBlog
        });
});

app.listen(process.env.PORT, () => {
    console.log(`App is running on http://localhost:${process.env.PORT}`);
});
