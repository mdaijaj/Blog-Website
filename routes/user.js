const jwt_decode = require('jwt-decode')   					
const nodemailer=require('nodemailer')


//Router
module.exports=(user,knex,jwt)=>{							
	var sentOTP=0;

	//external varibale define user every endpoints
	var user_details={}										

	// user signup fronted
	user.get("/user_signup",(req,res)=>{
		return res.sendFile(__dirname +"/views/signup.html")
	})
	
	//user login fronted
	user.get('/user_login', (req,res)=>{
		return res.sendFile(__dirname +"/views/login.html")
	})


	// new register signup backend
	user.post("/sign_up", (req,res)=>{
		var candidate={		
			"name": req.body.name,
			"surname": req.body.surname,
			"email": req.body.email,
			"password": req.body.password,
			"confirm_password": req.body.confirm_password
		}
		user_details=candidate;
		var oneTimePass = Math.floor(Math.random()*(9999))
		sentOTP=oneTimePass;
		if(user_details.password===user_details.confirm_password){
			knex("users")
			.select('email').where('email', user_details["email"])
			.then((data)=>{
				// console.log(data)
				if(data.length>0){
                    res.send("User already register please Click <a href=\"http://127.0.0.1:2050/user_login\">here</a> to login....")
				}
				else{
					// use of nodemailer
					var transporter = nodemailer.createTransport({ 
                        service: 'gmail',
                        secure: false,
                        port : 25,
                        auth: {
                            user : "aijaj18@navgurukul.org",
                            pass : "enter password"
                        },
                        tls: {
                            rejectUnauthorized:false
                        }
                    });
                    var mailOptions = {
                        from : user,
                        to : user_details.email.toString(),
                        subject : "Welcome to Medium blog website to confirm your mail",
                        text : "Your OTP is " + oneTimePass
					};
					if(transporter.sendMail(mailOptions)){
                        console.log(sentOTP)
                        res.sendFile(__dirname +'/views/otp.html')
                    }
                    else{
                        res.send("Couldn't send OTP.")
                    }
				}
			})
		}else{
			res.send("Password don't match please please enter again password....");
		} 
	})


	// verified backend code
	user.post("/verify", (req,res)=>{
		var enteredOTP=req.body.otp
		if(enteredOTP==sentOTP){
			// user['CreatedOn'] = new Date()
			knex('users')
			.insert({ name: user_details.name, email: user_details.email, password: user_details.password})
			.then((data)=>{
				console.log("sign_up is successfully!")
				return res.sendFile(__dirname +"/views/login.html")
			})
			.catch((err)=>{
				console.log(err.message);
				return res.send("error while inserting data...")
			})
		}else{
			console.log("aijaj Invalid OTP! Please input correct OTP.......")
            res.sendFile(__dirname +"/views/otp.html")
		}
	})
	

	// user login backend code
	user.post("/user_login", (req,res)=>{				
		var data = req.body        						 
		var token = jwt.sign(data,'shhhhh',{expiresIn:'1hr'});
		// console.log(token)
		res.cookie('qwsdr',token,{overwrite:true})
		var mycookie = req.headers.cookie;
		token=mycookie.slice(6,mycookie.length)
		var decodeToken = jwt_decode(token)
		// console.log(decodeToken)

		knex.select('*').from('users')
		.where('email', decodeToken.email).andWhere('password', decodeToken.password)
		.then((result) => {
			console.log(result)
			if(result.length>0){
				return res.render(__dirname +'/views/login_home.ejs', {data: result})
			}else{
				res.send("Invalid username and password")
			}
		})
		.catch((err) => {
			return res.send("there is something error while user and password");
		})
	})


	// home button backend code
	user.get("/home",(req,res)=>{
		knex
		.select("*")
		.from('blog_table')
		.then((blogdata) => {
			res.render(__dirname +'/views/home.ejs', {data: blogdata});
		})
		.catch((err) => {
			return res.send(err);
		})
	})
}
