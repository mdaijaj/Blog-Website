const express=require("express");
var bodyParser=require("body-parser")
var cookie = require("cookie-parser")
var mysql=require("mysql")									// using mysql knex
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')					//these all module of node js

var app=express();											//this is the framework app express 

app.set('view engine', 'ejs') 								//use of ejs file ejs convert data and fronted
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

var conn={
	host: "localhost",										//mysql connect database syntax
	user: "root",
	password: "aijaj123",
	database: "blog_medium"
}
var knex=require("knex")({client: "mysql", connection: conn});  //knex mysql connect using module of knex


//create users table
knex.schema.hasTable('users')
.then(function(exists){		
	if (!exists){
		knex.schema.createTable('users',function(table1){
		table1.increments('id').primary();
		table1.string('name').notNullable();
		table1.string('email').unique();
		table1.string('password');
		})
		.catch((err)=>{console.log(err.message)})
	}
	else{
		console.log("table is allready exists")
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
			console.log("table has been created");
		})
		.catch((err)=>{console.log(err.message)})
	}else{
		console.log("table is allready exists")
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