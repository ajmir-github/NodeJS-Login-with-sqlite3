// Routes: Users, URL: /items/
// This module focucs on users -- CRUD (Creact Read Update Delete)

// Required Depenedecies
const express = require('express');
const router = express.Router();
const { database , items_nextId, escape } = require("../database/database");
const { authToken } = require("../controllers/token");

// Globle settings

// Requests: Create ------------------------------------------
   // create items url /items/create/
   // only authenticated users can do this
router.post("/create", authToken, (req, res)=>{
   if(req.tokenAuth){
      const { email } = req.tokenProfile;
      database.all("SELECT id, authority FROM users WHERE email=?",[email], async (err, results)=>{
         if(JSON.parse(results[0].authority).users.write){
            const id = results[0].id;
            console.log('you can write');
            const { title, gender, size, price, color, description } = req.body;
            const newItemeId = await items_nextId();
      
            const item_data = JSON.stringify({
               description,
               color
            });
            const sql_query = "INSERT INTO items (id, title, gender , size , item_data , price , by_id , viewed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      
            const sql_data = [newItemeId , title, gender , size , item_data , price , id , 1];
            database.run(sql_query, sql_data, (err)=>{
               if(!err){
                  res.send("item created");
               } else {
                  console.log(err);
                  res.send({err:true, message:"create does not work!"});
      
               }
            });
         } else {
            return res.send("Access denied! You dont have the authority to write an item!")
         }
      });
      
   } else {
      res.send("ACCESS DENIED!");
   }
   

});

// Requests: Read ------------------------------------------
   // read all items url /items/read/
router.get("/read", (req, res)=>{
   const sql_read_items = "SELECT * FROM items";

   database.all(sql_read_items, (err, results)=>{
      if(!err){
         res.send(results)
      } else {
         res.send({err:true, message:"read does not work!"});
      }
   });
});


   // read all items url /items/read/id
   // increment the view colom for the asked item
router.get("/read/:id", (req, res)=>{
   const { id } = req.params;
   const sql_read_items = "SELECT * FROM items WHERE id=?";

   database.all(sql_read_items,[ id ], (err, results)=>{
      if(!err){
         res.send(results)
         
         // if(results.length == 0){
         //    res.send("not found");
         // } else {
         //    const { viewed } = results[0];
         //    database.run("UPDATE items SET viewed =? WHERE id = ?", [(Number(viewed)+1), id]);
         //    res.send({err:false, results})
         // }
      } else {
         res.send({err:true, message:"read_lastest does not work!"});

      }
   });
});
   // read lastest items url /items/read_lastest
router.get("/read_lastest", (req, res)=>{
   const sql_read_items = "SELECT * FROM items ORDER BY id DESC LIMIT 9";

   database.all(sql_read_items, (err, results)=>{
      if(!err){
         // res.send({err:false, results})
         res.send(results);

      } else {
         res.send({err:true, message:"read_lastest does not work!"});
      }
   });
});
   // read viewed items url /items/read_viewed
router.get("/read_viewed", (req, res)=>{
   const sql_read_items = "SELECT * FROM items ORDER BY viewed DESC LIMIT 5";

   database.all(sql_read_items, (err, results)=>{
      if(!err){
         res.send({err:false, results})
      } else {
         res.send({err:true, message:"read_viewed does not work!"});
      }
   });
});

// read by searching items url /items/search
router.post("/search", (req, res)=>{
   const string = `%${req.body.searchInput}%`;
   // id, title, gender , size , item_data , price , by_id , viewed

   const sql_read_items = "SELECT * FROM items WHERE title LIKE ? OR gender LIKE ? OR item_data LIKE ? ORDER BY id DESC LIMIT 20";

   database.all(sql_read_items,[string, string, string], (err, results)=>{
     res.send(results);
   });
});

// filter the items /items/filter/
router.post("/filter", (req, res)=>{
   const { body } = req;
   let arrBody = [];
   const keys = Object.keys(body);
   Object.values(body).filter((val, ind)=>{
      if(val != ''){
         arrBody.push([keys[ind], val]);
      }
   });
   let farmatedString = '';
   let neededColums = '';
   if(arrBody.length == 1){
      farmatedString += `${arrBody[0][0]} LIKE '%${arrBody[0][1]}%' `;
      neededColums += arrBody[0][0];
   } else {
      arrBody.forEach((val, ind)=>{
         if(ind == 0){
            farmatedString += `${val[0]} LIKE '%${val[1]}%' `;
            neededColums += arrBody[0][0];
         } else {
            farmatedString += `OR ${val[0]} LIKE '%${val[1]}%' `;
            neededColums += ", "+val[0];

         }
      });
   }
   const sql_filter_items = `SELECT * FROM items WHERE ${farmatedString}ORDER BY id DESC LIMIT 20`;
   console.log(sql_filter_items);
   database.all(sql_filter_items, (err, results)=>{
      return res.json(results);
   });
});


// Requests: Update ------------------------------------------
   // updating an item by sending new info
   // only authenticated users can do this
router.post('/update/:id', (req, res)=>{
   const { id } = req.params;
   const { title, description, price, type } = req.body;
   database.all("SELECT * FROM items WHERE id = ?",[id], (err, results)=>{
      if(!err){
         if(results.length !== 0){
            const sql_update = "UPDATE items SET title=?, description=?, price=?, type=? WHERE id=?";

            database.run(sql_update, [title, description, price, type, id], (err)=>{
               if(!err){
                  res.json({err:false, message:"Id updated!"})
               } else {
                  res.json({err:true, message:"Id cannot be changed!"});
               }
            });
         } else {
            res.json({err:true, message:"This id does not exist!"});
         }
      } else {
         console.log({err:true, message:"Id cannot be changed!"});
      }
   });

   
});

// Requests: Delete ------------------------------------------
   // deleting an item addressed by id
   // only authenticated users can do this
router.delete("/delete/:id", (req, res)=>{
   const { id } = req.params;
   database.run("DELETE FROM items WHERE id=?", [id], (err)=>{
      if(!err){
         res.json({err:false, message:"Id deleted!"});
      } else {
         res.json({err:true, message:"Id cannot be deleted!"});
      }
   })
});

// Exporting Module
module.exports = router;