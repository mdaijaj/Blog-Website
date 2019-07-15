const jwt_decode = require('jwt-decode')
module.exports=(blog,knex)=>{

	blog.post('/add_blogs', (req,res)=>{
		var blog_title=req.body.blog_title;
		var image_link=req.body.image_link;
		var blog_text=req.body.blog_text;
		var token = req.headers.cookie;
		var email=jwt_decode(token).email

		knex('blog_table').insert([{id:null,email:email, blog_title:blog_title, image_link:image_link, blog_text:blog_text}])
		.then((result)=>{
			knex
			.select('*')
			.from('blog_table')
			.then((selectresult) => {
				console.log(__dirname);
				res.render('login_home.ejs', {data: selectresult});
			})
			.catch((err) => {
				console.log(err)
			})
		})
		.catch((err)=>{
			console.log("done")
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