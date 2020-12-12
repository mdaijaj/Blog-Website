const express=require("express");
const bodyParser=require("body-parser")	
const app=express();	
require('dotenv').config()


//use of ejs file ejs convert data and fronted middleware..
app.use(express.static(__dirname + '/Routes/views'))
app.use(express.static(__dirname + '../public'));
app.set('view engine', 'ejs') 								
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//db connected
const knex=require('./models/models')

//this is only for routes or routers
const user=express.Router();
app.use('/', user)
require('./routes/user')(user, knex)

const blog=express.Router();
app.use('/', blog)
require('./routes/blog')(blog,knex)

const feed=express.Router();
app.use('/', feed)
require('./routes/feedback')(feed, knex)


//server 
var port=process.env.Port || 2050 ;
app.listen(port,()=>{
	console.log("server is running",port);
});
