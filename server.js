// using mysql knex
const express=require("express");
var bodyParser=require("body-parser")
const jwt = require('jsonwebtoken')
// var mysql=require("mysql")									
				

//this is the framework app express 
var app=express();											

//use of ejs file ejs convert data and fronted
app.set('view engine', 'ejs') 								
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//mysql connect database syntax
var conn={
	host: "localhost",										
	user: "root",
	password: "database password",
	database: "blog"
}

//knex mysql connect using module of knex
var knex=require("knex")({
	client: "mysql", connection: conn
});  


//create users table
knex.schema.hasTable('users')
.then(function(exists){		
	if (!exists){
		knex.schema.createTable('users',function(table1){
		table1.increments('id').primary();
		table1.string('name').notNullable();
		table1.string('email').unique();
		table1.string('password');
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
.then(function(exists){		  
	if (!exists){
		knex.schema.createTable('blog_table',function(table2){
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

//this is only for routes or routers
const user=express.Router();
app.use('/',user)
require('./routes/user')(user,knex,jwt)

const blog=express.Router();
app.use('/',blog)
require('./routes/blog')(blog,knex)


var port=2050 ;
app.listen(port,()=>{
	console.log("server is running",port);
});
