const jwt_decode = require('jwt-decode')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')	
const path=require('path')
require('dotenv').config()

//Router
module.exports = (user, knex) => {

	// user signup fronted
	user.get("/user_signup", (req, res) => {
		return res.sendFile(path.join(__dirname, '../' + '/views/signup.html'))
	})

	//user login fronted
	user.get('/user_login', (req, res) => {
		return res.sendFile(path.join(__dirname, '../' + '/views/login.html'))
	})


	// new register signup backend
	var sentOTP = 0;
	//external varibale define user every endpoints
	var user_details = {}

	user.post("/sign_up", (req, res) => {
		var candidate = {
			"name": req.body.name,
			"surname": req.body.surname,
			"email": req.body.email,
			"password": req.body.password,
			"confirm_password": req.body.confirm_password
		}
		user_details = candidate;
		var oneTimePass = Math.floor(Math.random() * (9999))
		sentOTP = oneTimePass;
		if (user_details.password === user_details.confirm_password) {
			knex("users")
				.select('email').where('email', user_details["email"])
				.then((data) => {
					if (data.length > 0) {
						res.send("User already register please Click <a href=\"http://13.127.38.252:2050/user_login\">here</a> to login....")
					}
					else {
						// use of nodemailer
						var transporter = nodemailer.createTransport({
							service: 'gmail',
							secure: false,
							port: 25,
							auth: {
								user: "enter your email id",
								pass: "enter your password"
								// pass: process.env.pass
							},
							tls: {
								rejectUnauthorized: true
							}
						});
						var mailOptions = {
							from: user,
							to: user_details.email.toString(),
							subject: "Welcome to Medium blog website to confirm your mail",
							text: "Your OTP is " + oneTimePass
						};
						if (transporter.sendMail(mailOptions)) {
							console.log(sentOTP)
							res.sendFile(path.join(__dirname, '../' + '/views/otp.html'))
						}
						else {
							res.send("Couldn't send OTP.")
						}
					}
				})
		} else {
			res.send("Password don't match please please enter again password....");
		}
	})


	// verified backend code
	user.post("/verify", (req, res) => {
		var enteredOTP = req.body.otp
		if (enteredOTP == sentOTP) {
			// user['CreatedOn'] = new Date()
			knex('users')
				.insert({ name: user_details.name, email: user_details.email, password: user_details.password })
				.then((data) => {
					console.log("sign_up is successfully!")
					return res.sendFile(path.join(__dirname, '../' + '/views/login.html'))
				})
				.catch((err) => {
					console.log(err.message);
					return res.send("error while inserting data...")
				})
		} else {
			console.log("aijaj Invalid OTP! Please input correct OTP.......")
			res.sendFile(path.join(__dirname, '../' + '/views/otp.html'))
		}
	})


	// user login backend code4205
	user.post("/user_login", (req, res) => {
		var data = req.body
		console.log(data)
		var token = jwt.sign(data, 'shhhhh', { expiresIn: '2hr' });
		res.cookie('qwsdr', token, { overwrite: false })
		var mycookie = req.headers.cookie;
		token = mycookie.slice(6, mycookie.length)
		var decodeToken = jwt_decode(token)
		knex.select('*').from('users')
		.where('email', decodeToken.email).andWhere('password', decodeToken.password)
		.then((result) => {
			if(result.length > 0) {
				knex.select("*").from("blog_table")
					.then((data) => {
						console.log(data,result)
						return res.render('login_home.ejs', { data: data, result })
					})
					.catch((err)=>{
						console.log(err)
					})
			}else{
				console.log("Invalid username and password...")
				res.send("Invalid username and password...")
			}
		})
		.catch((err) => {
			return res.send("there is something error while user and password");
		})
	})


	// login button backend and fronted code
	user.get("/home",(req,res)=>{
		knex.select("*").from('blog_table')
		.then((blogdata) => {
			res.render('home.ejs', {data: blogdata})
		})
		.catch((err) => {
			res.send(err);
		})
	})
}
