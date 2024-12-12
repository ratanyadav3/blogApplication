import { User as userModel } from '../models/user_model.js';
import { Router } from "express";
import cookieParser from 'cookie-parser';

const router = Router();

router.use(cookieParser());

// Render Signin Page
router.get('/signin', (req, res) => {
    res.render('signin');
});

// Handle Signin
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('signin', { error: "Email and Password are required." });
        }

        const regUser = await userModel.findOne({ email });
        if (!regUser) {
            return res.render('signup', { error: "User not found. Please sign up." });
        }

        // Check password
        const pass = await regUser.isPasswordCorrect(password); // Assuming it's an async method
        if (!pass) {
            return res.render('signin', { error: "Invalid email or password." });
        }


        const token =  regUser.generateAccessToken();
        res.cookie("token", token, {
            httpOnly: true, 
        });

        res.redirect('/');

    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).send("An error occurred while signing in.");
    }
});

// Render Signup Page
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Handle Signup
router.post('/signup', async (req, res) => {
    try {
        const { email, username, fullname, password } = req.body;

        // Ensure required fields are provided
        if (!email || !username || !fullname || !password) {
            return res.render('signup', { error: "All fields are required." });
        }

        // Check if user already exists
        const createUser = await userModel.findOne({ email });
        if (createUser) {
            return res.render('signin', { error: "User already exists. Please sign in." });
        }

        // Create new user
        const newUser = await userModel.create({
            email,
            username,
            fullname,
            password
        });


        // Generate token and set cookie
        const token = newUser.generateAccessToken();
        res.cookie("token", token);

        res.redirect('/');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send("An error occurred while signing up.");
    }
});

// Logout route (should not be inside signup route)
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

export { router };
