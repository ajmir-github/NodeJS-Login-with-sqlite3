// SQLITE3
const sqlite3 = require("sqlite3");

const database = new sqlite3.Database(`./database/source.db`, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

database.serialize(() => {
    console.log("--- Database source file conneted!");
    // USERS TABLE WITH ITS STRUCTURE ------------------
    // STRUCTURE QUERY : Users
    const users_sql = "CREATE TABLE users (id PRIMARY KEY, email, password, authority, history, user_data, entries)";

    database.run(users_sql, (err) => {if (!err) {console.log("--- Users table created!");}});


    // ITEMS TABLE WITH ITS STRUCTURE  ------------------
    // STRUCTURE QUERY : items
    // ID, Title, Gender, Size, item_data(color, company, year, description), Price, by_id, viewed

    const items_sql = "CREATE TABLE items (id PRIMARY KEY, title, gender , size , item_data , price , by_id , viewed)";

    database.run(items_sql, (err) => {if (!err) {console.log("--- items table created!");}});
});


// This is to set a defult Admin user

const hashing = async (password, hashingTimes = 1) => {
    const bcrypt = require("bcryptjs");
    const results = await bcrypt.hash(password, hashingTimes);
    return results;
}

const id = 0;
const email = "ajmir.ng3@gmail.com";
const password = "An123456";
const username = "Ajmir Raziqi";

const authority = JSON.stringify({
    type_name:"Admin",
    users:{
       read:true,
       write:true,
       update:true,
       delete:true
    },
    items:{
       write:true,
       update:true,
       delete:true
    }
});

const history = JSON.stringify([0, "Admin is created!", (new Date()).getFullYear()]);

const user_data = JSON.stringify({
    username:username,
    profile_photo:"admin.jpg",
    phone_number:'0093771210549',
    email:"ajmir.ng3@gmail.com"
});

const entries = JSON.stringify([]);

const sql = "INSERT INTO users (id, email, password, authority, history, user_data, entries) VALUES (?, ?, ?, ?, ?, ?, ?)";

hashing(password).then(pass=>{
    database.run(sql,[id, email, pass, authority, history, user_data, entries], (err)=>{
        if(!err){
        console.log("--- Admin added");
        } else {
        // console.log(err);
        console.log("+++ Admin not added");
        }
    });

    database.all("SELECT * FROM users", (err, results)=>{
        console.log(results[0]);
        console.log(JSON.parse(results[0].authority));
      });
      
});




// const sql = "INSERT INTO items (id, title, gender, size, item_data, price, by_id, viewed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

// database.run(sql,[0, 'title', 'gender', 'size', 'item_data', 'price', 'by_id', 'viewed'], (err)=>{
//   if(!err){
//     console.log("user added");
//   } else {
//     console.log(err);
//     console.log("user not added");
//   }
// });


// database.all("SELECT * FROM items", (err, results)=>{
//   console.log(results);
// });