const jwt_decode = require('jwt-decode')
var cookie = require("cookie-parser")


module.exports=(blog, knex)=>{

	// add blog button fronted
	blog.get("/post_blog",(req,res)=>{
		return res.sendFile(__dirname +"/views/post_blog.html")
	})

	// update blog button fronted
	blog.get("/update_blog",(req,res)=>{
		return res.sendFile(__dirname +"/views/update.html")
	})

	blog.get("/imageupload", (req,res)=>{
		return res.sendFile(__dirname + "/views/imageupload.html")
	})
	// delete blog button fronted
	// blog.get('/delete_blog',(req,res)=>{
	// 	return res.sendFile(__dirname + "/views/delete_blog.html")
	// })


	// only user get data backend
	blog.get("/all_get",(req,res)=>{
		var users = req.headers.cookie;
		// console.log(users)
		users = users.split(';')
		users = users[users.length-1]
		if(users.startsWith	(" qwsdr=")){
			users = users.slice(7, users.length-1)
			// console.log(users)
			var username = jwt_decode(users).email;
			console.log(username)
		}
		else{
			// var username = jwt_decode(users[users.length-1]).email;
			var username= jwt_decode(users).email;
		}
		knex.select("*").from('blog_table').where('email', username)
		.then((blogdata) => {
			console.log(blogdata)
			return res.render(__dirname+'/views/all_get.ejs', {data: blogdata})
		})
		.catch((err) => {
			res.send(err);
		})
	})	


	// add blog backend code
	blog.post('/add_blogs', (req,res)=>{
		var image_url=req.body.image_url
		var name=req.body.name;
		var profession=req.body.profession
		var created_at=req.body.created_at
		var title=req.body.title;
		var description=req.body.description;
		var blog_text=req.body.blog_text;
		var token = req.headers.cookie;
		token = token.split(';')
		token = token[token.length-1]
		if(token.startsWith(" qwsdr=")){
			token = token.slice(7, token.length-1)
			// console.log(token)
			var username = jwt_decode(token);
			// console.log(username)
		}
		// else{
			// var username = jwt_decode(token[token.length-1]).email;
		// }
		var username=jwt_decode(token).email;
		console.log(username)

		knex('blog_table')
		.insert({id: null, image_url: image_url, name: name, profession: profession, created_at: created_at, email: username, title: title, description: description, blog_text: blog_text})
		.then((result)=>{
			console.log(result);

			knex.select("*").from("blog_table")
			.then((select_result) => {
				// console.log(select_result)
				return res.render(__dirname +'/views/login_home.ejs', {data: select_result});
			})
			.catch((err) => {
				console.log(err);
			})
		}) 
		.catch((err)=>{
			console.log(err)
			return res.send("data is allready exists");
		})
	});





	// blog_details fronted and  backend code
	blog.get("/blog_details", (req, res) => {
		knex.select("*").from('blog_table').where('id', req.query.id)
		.then((blogdata) => {
			console.log(blogdata)
			return res.render(__dirname + '/views/blog_details.ejs', { data: blogdata })
		})
		.catch((err) => {
			res.send(err);
		})
	})

	// user_details fronted and backend code
	blog.get("/user_detail", (req,res)=>{
		knex.select("*").from("blog_table").where('id', req.query.id)
		.then((data)=>{
			console.log(data)
			return res.render(__dirname + '/views/user_detail.ejs', {data: data})
		})
		.catch((err)=>{
			console.log(err)
		})
	})


	// home button backend code
	blog.get("/login_home", (req, res) => {
		knex.select("*").from('blog_table')
		.then((blogdata) => {
			res.render(__dirname + '/views/login_home.ejs', { data: blogdata });
		})
		.catch((err) => {
			return res.send(err);
		})
	})

	
	// filter or search backend code // make html page
	blog.post("/search", (req,res)=>{
		var keyvalues=req.body.search
		console.log(keyvalues)
		knex('blog_table').where('title', 'like', '%'+keyvalues +'%').orWhere('email', 'like', '%'+keyvalues +'%')
		.then((data)=>{
			console.log(data)
			return res.render(__dirname + "/views/search.ejs", {data: data});
		})
		.catch((err)=>{
			console.log(err)
			return res.send("not found data.....")
		})
	})
		

	// update blogs backend code.
	blog.get('/update_data', (req,res)=>{
		var id=req.query.id
		var title=req.query.title
		var description=req.query.description
		var blog_text= req.query.blog_text
		console.log("id:", id, description, title, blog_text)

		knex("*").from("blog_table")
		.update({
			title: title,
			description: description, 
			blog_text: blog_text
		})
		.where('id',id)
		.then((data)=>{
			console.log("aijaj")
			console.log("data is update successfully:", data);

			knex.select("*").from("blog_table")
			.then((select_result) => {
				return res.render(__dirname +'/views/login_home.ejs', {data: select_result});
			})
			.catch((err) => {
				console.log(err);
			})
		})
		.catch((err)=>{
			return res.send("please choose correct id....")
		})
	});


	//delete blog backend code.
	blog.get('/delete_blog', (req,res)=>{
		knex.select("*").from('blog_table').where('id', req.query.id).del()
		.then(()=>{
			knex.select("*").from("blog_table")
			.then((all_data)=>{
				return res.render(__dirname +"/views/login_home.ejs", {data: all_data})
			})
			.catch((err)=>{
				console.log("error while querry ", err)
			})
		})
		.catch((err)=>{
			res.send("please choose correct id....");
		})
	})


	// // image upload using multer module
	
	// const storage=multer.diskStorage({
	// 	destination: './public/uploads/', 
	// 	filename: (req,res,cb)=>{
	// 		cb(null, "myImage" + '-' + Date.now() + path.extname("myImage"));
	// 	}
	// })
	
	// const upload=multer({
	// 	storage: storage,
	// 	limits: {fileSize: 1000000},
	// 	fileFilter: function(req, file, cb){
	// 		checkFiletype(file, cb)
	// 	}
	// }).single('myImage')
	
	// function checkFiletype(file,cb){
	// 	//check file types
	// 	const filetypes= /jpeg|jpg|png|gif/;
	
	// 	// allowed ext
	// 	const extname= filetypes.test(path.extname (file.originalname).toLowerCase());
	
	// 	// check mime
	// 	const mimetype= filetypes.test(path.extname (file.originalname).toLowerCase());
	
	// 	if(mimetype && extname){
	// 		return cb(null, true);
	// 	}else{
	// 		cb("error: Images only support...")
	// 	}
	// }

	// blog.post('/upload', (req, res)=>{
	// 	console.log("aijaj")
	// 	upload(req,res, (err)=>{
	// 		if(err){
	// 			res.render('index', {
	// 				msg: err
	// 			});
	// 		}else{
	// 			console.log(req.file);
	// 			if(req.file==undefined){
	// 				res.render("index", {
	// 					msg: 'Error: no file selected....'
	// 				});
	// 			}else{
	// 				res.render('index', {
	// 					msg: "File Uploaded success!", 
	// 					file: `uploads/${req.file.filename}`
	// 				});
	// 			}
	// 		}
	// 	}) 
}	