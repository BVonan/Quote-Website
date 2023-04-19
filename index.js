const express = require("express");
const mysql = require('mysql');
const app = express();
const pool = dbConnection();

app.set("view engine", "ejs");
app.use(express.static("public"));

//routes
app.get('/', async function(req, res) {

    sql = `SELECT q.authorId, q.firstName, q.lastName
            FROM q_authors q 
            ORDER BY q.firstName`;
    let rows = await executeSQL(sql);
    sql = "SELECT DISTINCT q.category FROM q_quotes q ORDER BY q.category";
    let categories = await executeSQL(sql);

    res.render('home', { 'authors': rows, "cat": categories });

});

//Author
app.get("/findByKeyword", async function(req, res){
	let keyword = req.query.keyword;
	let sql = `SELECT firstName, lastName, quote, authorId
		 FROM q_quotes q
		 NATURAL JOIN q_authors a
		 WHERE quote LIKE ? `;

  let params = [`%${keyword}%`];
	
	let rows = await executeSQL(sql, params);
	res.render('results', {'quotes': rows});
});//findByKeyWord

// author
app.get("/findByAuthor", async function(req, res) {


    let authorId = req.query.authorId;
    
    let sql = `SELECT firstName, lastName, quote, authorId
  FROM q_quotes q
    NATURAL JOIN q_authors a
    WHERE authorId = ? ;`

    let params = [`${authorId}`];
    let rows = await executeSQL(sql,params);
    
    res.render('results', { 'quotes': rows });
});//findByAuthor

//author pop up
app.get("/api/author/:authorId", async function(req, res){
	let id = req.params.authorId;
	let sql = `SELECT *
		 FROM  q_authors 
		 WHERE authorId = ? `;

  let params = [id];
	
	let rows = await executeSQL(sql, params);
	res.send(rows[0]);
});//findByAuthor pop up


app.get('/findByCategory', async function(req, res) {

    let cat = req.query.category;
    let  authorId = req.query.authorId;
    
    sql = `SELECT firstName, lastName, quote, authorId
        FROM q_quotes q
                NATURAL JOIN q_authors a
                WHERE q.category = ${cat}
        ORDER BY likes DESC`;
    let params = [`${authorId}`];
    let rows = await executeSQL(sql,params);
    res.render('results', { 'quotes': rows });

}); //find by category

// likes
app.get('/likes', async function (req, res)  {

   sql = `SELECT *
        FROM q_quotes
        WHERE likes BETWEEN 100 AND 200
        ORDER BY quote
        q_quotes`

  res.render('home');

}); //find by likes


app.get("/dbTest", async function(req, res){
let sql = "SELECT CURDATE()";
  

  sql = `SELECT *
         FROM q_quotes
         WHERE quote LIKE "%life%"
         ORDER BY likes DESC`;
let rows = await executeSQL(sql);
res.send(rows);
});//dbTest

//functions
async function executeSQL(sql, params){
return new Promise (function (resolve, reject) {
pool.query(sql, params, function (err, rows, fields) {
if (err) throw err;
   resolve(rows);
});
});
}//executeSQL
//values in red must be updated
function dbConnection(){

   const pool  = mysql.createPool({

      connectionLimit: 10,
      host: "en1ehf30yom7txe7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "dv2ugc6ntjt6mllx",
      password: "vk4ndv9f3uturr6y",
      database: "gtusgzafuiueu0xi"

   }); 

   return pool;

} //dbConnection

//start server
app.listen(3000, () => {
console.log("Expresss server running...")
} )