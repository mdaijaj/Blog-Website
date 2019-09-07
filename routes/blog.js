const jwt_decode = require('jwt-decode')
module.exports=(blog,knex)=>{

	blog.post('/add_blogs', (req,res)=>{
		var blog_title=req.body.blog_title;
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
		
		else{
			// var username = jwt_decode(token[token.length-1]).email;
			var username=jwt_decode(token).email;
		}

		knex('blog_table')
		.insert({id: null, email: username, blog_title: blog_title, description: description, blog_text: blog_text})
		.then((result)=>{
			console.log(result);
			knex
			.select("*")
			.from("blog_table")
			.then((select_result) => {
				// console.log(__dirname);
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

	// 	var promise1 = function () {
 //  			return res.send(Promise.reject());
	// 	};
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
		knex('blog_table').where('id',id).update({title:title, blog_text:blog_text})
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


