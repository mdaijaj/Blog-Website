//using mysql knex
// const mailer=require("nodemailer") 
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')		//these all module of node js
const express=require("express");
var mysql=require("mysql")
var bodyParser=require("body-parser")
var cookie = require("cookie-parser")


var app=express();								//this is the framework app express 

app.set('view engine', 'ejs') 					//use of ejs file ejs convert data and fronted
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

var conn={
	host: "localhost",							//mysql connect database syntax
	user: "root",
	password: "aijaj",
	database: "blog"
}
var knex=require("knex")({client: "mysql", connection: conn});  //knex mysql connect using module of knex

	knex.schema.hasTable('users').then(function(exists){		//create users table
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

	knex.schema.hasTable('blog_table').then(function(exists){		//create blog_table  
		if (!exists){
			knex.schema.createTable('blog_table',function(table2){
			 	table2.increments('id').primary();
			 	table2.string('email').notNullable();
			 	table2.string('blog_title').notNullable();
			 	table2.string('image_link');
			 	table2.string('blog_text');
		 		console.log("table has been created")
		 	})
		 	.catch((err)=>{console.log(err.message)})
		}else{
			console.log("table is allready exists")
		}
	});	
	

 //connect files each others end point;
app.get('/user_login', (req,res)=>{
	return res.sendFile(__dirname +"/views/login.html")
})

app.get("/user_signup",(req,res)=>{
	return res.sendFile(__dirname +"/views/signup.html")
})

app.get("/home",(req,res)=>{
	console.log(__dirname)
	knex
	.select("*")
	.from('blog_table')
	.then((blogdata) => {
		res.render('home.ejs', {data: blogdata})
	})
	.catch((err) => {
		return res.send(err);
	})
})

app.get("/login_home",(req,res)=>{
	console.log(__dirname)

	knex
	.select("*")
	.from('blog_table')
	.then((blogdata) => {
		res.render('login_home.ejs', {data: blogdata})
		res.send(data)
	})
	.catch((err) => {
		res.send(err);
	})
})

app.get("/post_blog",(req,res)=>{
	return res.sendFile(__dirname +"/views/post_blog.html")
})

app.get("/all_get",(req,res)=>{
	console.log(__dirname)
	var users = req.headers.cookie;
	
	users = users.split(' ')
	// console.log(users)
	var username = jwt_decode(users[users.length-1]).email
	console.log(username)

	knex
	.select("*")
	.from('blog_table')
	.where('email', username)
	.then((blogdata) => {
		console.log(blogdata)
		return res.render(__dirname+'/views/all_get.ejs', {data: blogdata})
	})
	.catch((err) => {
		res.send(err);
	})

	// use back button
	// res.redirect('back')
})	


//this is only for routes or routers
const user=express.Router();
app.use('/',user)
require('./routes/user')(user,knex,jwt)


const blog=express.Router();
app.use('/',blog)
require('./routes/blog')(blog,knex)

app.listen(2050,()=>{
	console.log("server is running");
});