// Requried Dependencies
const jwt = require("jsonwebtoken");
const { database } = require("../database/database");


// this is token setting after authenticating the user in the database
module.exports.setToken = (req, res) => {
    const id = req.loginId;
    const { email, password } = req.body;
    const token = jwt.sign({ id, email, password }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    const timeLength = (process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000);
    const cookieOptions = {
        expires: new Date(Date.now() + timeLength),
        httpOnly: true,
        signed:false
    };
    res.cookie(process.env.JWT_COOKIE_NAME, token, cookieOptions);
    res.redirect("/profile");
};

// This Meddleware is to authenticate the token and saves the token in 
    // req.tokenAuth variable
    // req.tokenProfile = json file
module.exports.authToken = (req, res, next) => {
    const cookie = req.cookies[process.env.JWT_COOKIE_NAME];
    if(cookie){
        // check the cookie is modified of not ???
        try {
            req.tokenProfile = jwt.verify(cookie, process.env.JWT_SECRET_KEY);;
            // User verified
            req.tokenAuth = true;
            next();
        } catch (error) {
            // Access Denied! Due to invalid signature
            console.log("-X- Server Attacked Using invalid signature");
            req.tokenAuth = false;
            next();
        }
    } else {
        // Access Denied! Due not having authenticated token
        req.tokenAuth = false;
        next();

    }
};
