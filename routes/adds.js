// Routes: Adds

// Required Depenedecies
const express = require('express');
const router = express.Router();
const { database , items_nextId, escape } = require("../database/database");

console.log('adds connectedS');
// Routes
router.get("/", (req, res)=>{
    let dataOut = '';
    let sample = [
        {title:"W3schools", info:"Learn Web designing", link:"w3school.com"},
        {title:"Udemy", info:"Learn Programming", link:"udemy.com"},
        {title:"FreeCodeCamp", info:"Learn Programming for Free", link:"freecodecamp.com"}

    ];
    sample.forEach(({title, info, link}) => {
        let html = (`
        <div class="card mt-4">
            <div class="card-body">
                <h4 class="card-title">${title}</h4>
                <p class="card-text">${info}</p>
                <a href="${link}" class="card-link">Read More!</a>
            </div>
        </div>`);
        dataOut += html;
    });
    res.json(dataOut);
});


// Exporting Module
module.exports = router;