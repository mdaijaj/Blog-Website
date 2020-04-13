// using mysql knex
const express=require("express");
var bodyParser=require("body-parser")				

//this is the framework app express 
var app=express();										

//use of ejs file ejs convert data and fronted
app.use(express.static(__dirname + '/Routes/views'))
app.use(express.static(__dirname + '../public'));
app.set('view engine', 'ejs') 								
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
	

//mysql connect database syntax
var conn={
	host: "localhost",										
	user: "root",
	password: "enter password",
	database: "blog"
}

//knex mysql connect using module of knex
var knex=require("knex")({
	client: "mysql", connection: conn
});  

//create users table
knex.schema.hasTable('users')
.then((exists)=>{		
	if (!exists){
		knex.schema.createTable('users',(table2)=>{
		table2.increments('id').primary();
		table2.string('name').notNullable();
		table2.string('email').unique();
		table2.string('password');
		console.log("user table allready exists")
		})
		.catch((err)=>{console.log(err.message)})
	}
	else{
		console.log("users table is allready exists")
	}
});

//create blog_table
knex.schema.hasTable('blog_table')
.then((exists)=>{		  
	if (!exists){
		knex.schema.createTable('blog_table',(table2)=>{
			table2.increments('id').primary();
			table2.string('email').notNullable();
			table2.string('title').notNullable();
			table2.string('description').notNullable();
			table2.string('blog_text');
			console.log("blog_table has been created");
		})
		.catch((err)=>{console.log(err.message)})
	}else{
		console.log("blog_table is allready exists")
	}
});

//create categories table
knex.schema.hasTable('categories')
.then((exists)=>{		
	if (!exists){
		knex.schema.createTable('categories',(table2)=>{
		table2.increments('id').primary();
		table2.string('technology').notNullable();
		table2.string('business')
		table2.string('art & craft');
		table2.string('turist');
		table2.string('stock market')
		table2.string('finance')
		table2.string('books')
		table2.string('culture')
		table2.string('music')
		table2.string('game')
		table2.string('news')
		console.log("cetegories table allready exists")
		})
		.catch((err)=>{console.log(err.message)})
	}
	else{
		console.log("categories table is allready exists")
	}
});


//this is only for routes or routers
const user=express.Router();
app.use('/',user)
require('./routes/user')(user, knex)

const blog=express.Router();
app.use('/',blog)
require('./routes/blog')(blog,knex)

var port=2050 ;
app.listen(port,()=>{
	console.log("server is running",port);
});
