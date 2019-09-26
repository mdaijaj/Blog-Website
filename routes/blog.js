const jwt_decode = require('jwt-decode')
module.exports=(blog,knex)=>{

	// blog button path
	blog.get("/post_blog",(req,res)=>{
		return res.sendFile(__dirname +"/views/post_blog.html")
	})

	blog.get("/update_blog",(req,res)=>{
		return res.sendFile(__dirname +"/views/update.html")
	})

	blog.get('/delete_blog',(req,res)=>{
		return res.sendFile(__dirname + "/views/delete_blog.html")
	})

	blog.get("/all_get",(req,res)=>{
		var users = req.headers.cookie;
		// console.log(users)
		users = users.split(';')
		users = users[users.length-1]
		if(users.startsWith	(" qwsdr=")){
			users = users.slice(7, users.length-1)
			console.log(users)
			var username = jwt_decode(users).email;
			console.log(username)
		}
		else{
			// var username = jwt_decode(users[users.length-1]).email;
			var username= jwt_decode(users).email;
		}
	
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
	})	

	blog.post('/add_blogs', (req,res)=>{
		var title=req.body.title;
		var description=req.body.description;
		var blog_text=req.body.blog_text;

		var token = req.headers.cookie;

		token = token.split(';')
		token = token[token.length-1]
		if(token.startsWith(" qwsdr=")){
			console.log(token)
			token = token.slice(7, token.length-1)
			console.log(token)
			var username = jwt_decode(token);
			console.log(username)
		}
		// else{
			// var username = jwt_decode(token[token.length-1]).email;
		var username=jwt_decode(token).email;
		// }
		knex('blog_table')
		.insert({id: null, email: username, title: title, description: description, blog_text: blog_text})
		.then((result)=>{
			console.log(result);
			knex
			.select("*")
			.from("blog_table")
			.then((select_result) => {
				return res.render(__dirname +'/views/login_home.ejs', {data: select_result});
			})
			.catch((err) => {
				console.log(err)
			})
		}) 
		.catch((err)=>{
			console.log(err)
			return res.send("data is allready exists");
		})
	})
	
	blog.get('/all_blogs/:id', (req,res)=>{
		var id=req.params.id;
		knex('blog_text').from('blog_table').where('id',id)
		.then((data)=>{	
			console.log("done");
			return res.send(data);
		})
		.catch((err)=>{
			return res.send("Please enter the correct id");
		})
	})
		
	blog.put('/update_blog/:id', (req,res)=>{
		var id=req.params.id;
		var title=req.body.title;
		var blog_text= req.body.blog_text;
		knex('blog_table').where('id',id)
		.update({title:title, blog_text:blog_text})
		.then((data)=>{
			console.log("data is update successfully");
			return res.send(data);
		})
		.catch((err)=>{
			return res.send("please choose correct id....")
		})
		res.send("data updated successfully!")
	});

	blog.delete('/delete_blog/:id', (req,res)=>{
		knex('blog_table').where('id',req.params.id).delete()
		.then(()=>{
			return res.send("delete is successfully!");
		})
		.catch((err)=>{
			return res.send("please choose correct id....");
		})
	})		
}

