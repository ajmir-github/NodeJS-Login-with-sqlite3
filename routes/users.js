// Routes: Users, URL: /users/
// This module focucs on users -- CRUD (Creact Read Update Delete)

// Required Depenedecies
const express = require('express');
const router = express.Router()
const { database, users_nextId } = require("../database/database");
const bycrypt = require("bcryptjs");
const token = require("../controllers/token");
// Globle settings
const hash_times = 1;

//  Request: create an email
   // create a user and set a profile photo to it URL: /users/create
   // make sure not to dublicate user in respect to emails
   // encrypt the password
   // send a token to the client
router.post("/create", token.authToken, async (req, res)=>{
   if(req.tokenAuth){
      // check if the user is allowed to create and email
      const profile = req.tokenProfile;
      database.all("SELECT id, authority FROM users WHERE email=?", [profile.email], async (err, results)=>{
         const canWrite = (JSON.parse(results[0].authority).users.write);
         const creatorId = results[0].id;
         if(canWrite){
            const {username, email, password} = req.body;
            const id = await users_nextId();
            const hashed_password = await bycrypt.hash(password, hash_times);
            database.all("SELECT email FROM users WHERE email = ?", [email], (err, results)=>{
               if(results.length == 0){
                  const authority = JSON.stringify({
                     type_name:"Pending",
                     users:{
                        read:false,
                        write:false,
                        update:false,
                        delete:false
                     },
                     items:{
                        write:false,
                        update:false,
                        delete:false
                     }
                  });

                  const history = JSON.stringify([creatorId, `Created by ${profile.email}`, (new Date()).getFullYear()]);

                  const user_data = JSON.stringify({
                     username:username,
                     profile_photo:"admin.jpg",
                     phone_number:'0093771210549',
                     email:"ajmir.ng3@gmail.com"
                  });

                  const entries = JSON.stringify([]);

                  const sql = "INSERT INTO users (id, email, password, authority, history, user_data, entries) VALUES (?, ?, ?, ?, ?, ?, ?)";
                  database.run(sql,[id, email, hashed_password, authority, history, user_data, entries], err=>{
                     return res.send("Email has created!");
                  });
               } else {
                  // email has already added
                  console.log("+++ email has already added");
                  return res.redirect("/profile");
               }
            });
         } else {
            return res.send("Access Dennied!");
         }
      });
 
   } else {
      res.send("Access Denied")
   }  
});
 

//  Request: login
   // set a jwt token
router.post("/login", async (req, res, next)=>{
   const { email, password } = req.body;
   database.all("SELECT password, id FROM users WHERE email=?",[email],async (err, results)=>{
      if(results.length == 1){
         const hashed_password = results[0].password;
         const id = results[0].id;
         const matched = await bycrypt.compare(password, hashed_password);
         if(matched){
            req.loginId = id;
            // token goes here
            return next();
         } else {
            return res.render("login", {err:true, message:"Entered password has not matched!"});
         }
      } else {
         return res.render("login", {err:true, message:"This Email has not found!"});
      }
   });

   // this is set a token
      // remember to put the user authority in the user's token
}, token.setToken);


// Logout Request
   // delete the token and redirect the user to login page
router.get("/logout", (req, res)=>{
   res.clearCookie(process.env.JWT_COOKIE_NAME);
   res.render("login", {err:false, message:"User has logged out!"})
});



router.get("/test", (req, res)=>{
   database.all("SELECT * FROM users",(err, results)=>{
      res.send(results);
      console.log(results);
   })
});


// Exporting Module
module.exports = router;