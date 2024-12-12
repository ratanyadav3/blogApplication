import jwt from 'jsonwebtoken';
export default function isLoggedIn(req, res, next) {
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
        console.log("No token found, user is not logged in."); 
        return res.redirect('/user/signin');
    }

    try {
        // Verify the token
        const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // Attach user info to the request object
        req.user = data;
        next();
    } catch (error) {
        console.error("Token verification failed: ", error.message);

        // Redirect to signin page if verification fails
        return res.redirect('/user/signin');
    }
}
