// Dependencies
const express = require('express');
const path = require('path');
const app = express();
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");

// Sittings and Global Variables
require("dotenv").config("./.env");
const port = process.env.PORT ||3000;

// Handlers
app.set("view engine", "ejs");

// Meddlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(fileupload());
app.use(cookieParser());

// Routes
app.use("/", require("./routes/pages"));
app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/items"));
app.use('/adds', require("./routes/adds"));



// Port activation
app.listen(port, ()=> console.log(`--- Listening on port: ${port}`))
