const jwt_decode = require('jwt-decode')
module.exports=(user,knex,jwt)=>{

	user.post("/sign_up", (req,res)=>{
		var name=req.body.name;
		var surname=req.body.surname;
		var email=req.body.email;
		var password=req.body.password;
		var user = req.body     			 //get all body data from user
		// console.log(user)
		knex('users').insert({ name:name, email:email, password:password})
		.then((data)=>{
			res.sendFile("/home/aijaj/Desktop/project/Blogs/login.html")
			// return res.send("sign_up is successfully!")
		})
		.catch((err)=>{
			console.log(err.message);
			return res.send("you already sign_up! plase go to login....")
		}) 
	})

	user.post("/user_login", (req,res)=>{
		var user_email=req.body.email;
		var user_password=req.body.password;
		var data = req.body        			 //get all body data from database

		var token = jwt.sign(data,'shhhhh',{expiresIn:'1hr'});
		res.cookie('qwsdr',token,{overwrite:true})
		var mycookie = req.headers.cookie;
		token=mycookie.slice(6,mycookie.length)
		// console.log(token)
		var decodeToken = jwt_decode(token)
		// console.log(decodeToken)

		knex
		.select('*').from('users')
		.where('email', user_email).andWhere('password',user_password)
		.then((result) => {
			console.log(result)
			if(result.length>0){
				return res.render('login_home.ejs', {data: result})
			}else{
				res.send("Invalid username and password")
			}
			})
		.catch((err) => {
			return res.send("there is error something while user and password");
		})
	})
}