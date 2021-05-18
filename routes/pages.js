// Routes: PAGES, URL: /
// This module focucs on pages and the best possible way to render them

// Required Depenedecies
const express = require('express');
const router = express.Router()
const token = require("../controllers/token");
const { database } = require("../database/database");

// Globle settings

router.get("/", (req, res)=>{
    res.render("index", {page_name:"HOME PAGE", name:"NODE LOGIN"})
 });

router.get("/login", token.authToken ,(req, res)=>{
    if(req.tokenAuth){
        res.redirect("/profile");
    } else {
        res.render("login", {page_name:"LOGIN PAGE", name:"NODE LOGIN"});
    }
});


    // req.tokenAuth variable
    // req.tokenProfile = json file
router.get("/profile", token.authToken, (req, res)=>{
    if(req.tokenAuth){
        const { email } = req.tokenProfile;
        database.all("SELECT user_data, authority, entries FROM users WHERE email=?",[email], (err, results)=>{

            const user_data = JSON.parse(results[0].user_data);
            const authority = JSON.parse(results[0].authority);
            const entries = JSON.parse(results[0].entries);

            res.render("profile", {page_name:"PROFiLE PAGE", email, user_data, authority, entries})
        });
    } else {
        res.render("login", {err:true, message:"Access denied. Login first!"})
    }
});

// Exporting Module
module.exports = router;