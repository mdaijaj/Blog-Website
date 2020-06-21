// using mysql knex
const express=require("express");
var bodyParser=require("body-parser")	
var fileupload = require("express-fileupload");
const cors = require('cors');


//this is the framework app express
var app=express();										

//use of ejs file ejs convert data and fronted
app.use(express.static(__dirname + '/Routes/views'))
app.use(express.static(__dirname + '../public'));
app.set('view engine', 'ejs') 								
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())


//mysql connect database syntax
var conn={
	host: "localhost",										
	user: "root",
	password: "aijaj123",
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
		knex.schema.createTable('users',(table1)=>{
		table1.increments('id').primary();
		table1.string('name').notNullable();
		table1.string('email').unique();
		table1.string('password');
		console.log("user table created success")
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
			table2.string('image_url');
			table2.string('name').notNullable();
			table2.string('profession').notNullable();
			table2.string('created_at').notNullable();
			table2.string('email').notNullable();
			table2.string('title').notNullable();
			table2.string('description').notNullable();
			table2.string('blog_text');
			console.log("blog_table has been created success");
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
		knex.schema.createTable('categories',(table3)=>{
		table3.increments('id').primary();
		table3.string('technology').notNullable();
		table3.string('business')
		table3.string('art & craft');
		table3.string('turist');
		table3.string('stock market')
		table3.string('finance')
		table3.string('books')
		table3.string('culture')
		table3.string('music')
		table3.string('game')
		table3.string('news')
		console.log("cetegories table created success")
		})
		.catch((err)=>{console.log(err.message)})
	}
	else{
		console.log("categories table is allready exists")
	}
});


//create users table
knex.schema.hasTable('feedback')
.then((exists)=>{		
	if (!exists){
		knex.schema.createTable('feedback',(table4)=>{
		table4.increments('id').primary();
		table4.string('name').notNullable();
		table4.string('email').unique();
		table4.integer('phone')
		table4.string('comments')
		console.log("feedback table  created successfully")
		})
		.catch((err)=>{console.log(err.message)})
	}
	else{
		console.log("feedback table is allready exists")
	}
});

	
//bookmark table
knex.schema.hasTable('bookmark')
.then((exists)=>{		
	if (!exists){
		knex.schema.createTable('bookmark',(table5)=>{
		table5.increments('id').primary();
		table5.integer('blog_id').notNullable();
		table5.foreign('blog_id').references('id').inTable('blog_table');
		console.log("bookmark table  created success")
		})
		.catch((err)=>{console.log(err.message)})
	}
	else{
		console.log("bookmark table is allready exists")
	}
});


// followers and following  table
knex.schema.hasTable('follow')
.then((exists)=>{		
	if (!exists){
		knex.schema.createTable('follow',(table6)=>{
		table6.increments('id').primary();
		table6.string('email').notNullable();
		table6.foreign('email').references('id').inTable('users');
		console.log("follow table  created success")
		})
		.catch((err)=>{console.log(err.message)})
	}
	else{
		console.log("follow table is allready exists")
	}
});


//this is only for routes or routers
const user=express.Router();
app.use('/',user)
require('./routes/user')(user, knex)

const blog=express.Router();
app.use('/',blog)
require('./routes/blog')(blog,knex)

const feed=express.Router();
app.use('/', feed)
require('./routes/feedback')(feed, knex)

var port=process.env.Port || 2050 ;
app.listen(port,()=>{
	console.log("server is running",port);
});
