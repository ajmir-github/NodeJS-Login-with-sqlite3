// SQLITE3
const sqlite3 = require("sqlite3");

const database = new sqlite3.Database(`./database/source.db`, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

let users_nextId = ()=>{
    return (new Promise((resolve, reject)=>{
        // database.serialize(function() {
            database.all("SELECT id FROM users", (err, results)=>{
                if(!err){
                    if(results.length == 0){
                        resolve(0);
                    } else {
                        resolve(Number(results[results.length-1].id)+1);
                    }
                } else {
                    reject(err);
                }
            });
        // });
    }));
}

let items_nextId = ()=>{
    return (new Promise((resolve, reject)=>{
        // database.serialize(function() {
            database.all("SELECT id FROM items", (err, results)=>{
                if(!err){
                    if(results.length == 0){
                        resolve(0);
                    } else {
                        resolve(Number(results[results.length-1].id)+1);
                    }
                } else {
                    reject(err);
                }
            });
        // });
    }));
}


const { escape } = require('mysql');
module.exports = {database, users_nextId, items_nextId, escape};


// users_nextId.then(id=>{
//     console.log(id);
// });

// items_nextId.then(id=>{
//     console.log(id);
// })
// test
    // const sql_add_user = "INSERT INTO users (id, username, email, password, usertype, profile, entries) VALUES ('6', 'username', 'email', 'password', 'usertype', 'profile', 'entries')";

    // db.run(sql_add_user, (err)=> {
    //     if(!err){
    //         console.log("--- User added")
    //     } else {
    //         console.log(err);
    //     }
    // });
    
    // db.all("SELECT * FROM users", (err, results)=>{
    //     if(!err){
    //         console.log(results);
    //     } else {
    //         console.log(err);
    //     }
    // });


    // const sql_add_item = "INSERT INTO items (id, title, description, price, img_src, type, viewed) VALUES ('3', 'title', 'description', 'price', 'img_src', 'type', 'viewed')";

    // db.run(sql_add_item, (err)=>{
    //     if(!err){
    //         console.log("item added");
    //     } else {
    //         console.log(err);
    //     }
    // });

    // db.all("SELECT * FROM items", (err, results)=>{
    //     if(!err){
    //         console.log(results);
    //     } else {
    //         console.log(err);
    //     }
    // });
