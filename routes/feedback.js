const aws = require("aws-sdk");
var fileupload = require("express-fileupload");


module.exports=(feed, knex)=>{
    
    //feedback backend api
	feed.post('/feedback', (req,res)=>{
        knex('feedback').insert({id: null, name: req.body.name, email: req.body.email, phone: req.body.phone, comments: req.body.comments})
        .then((data)=>{
            console.log(data)
            console.log("feedback sent sucessfully")
            return res.sendFile(__dirname + '/views/submit.html')
        })
        .catch((err)=>{
            console.log(err)
        })
    })
    

    // bookmark fronted and backend api
    feed.get('/bookmark', (req,res)=>{
        knex('bookmark').insert({blog_id: req.query.id})
        .then((data)=>{
            console.log(data)
            console.log("insert bookmark successfully")
            return res.send("bookmark saved successfully!")
        }).catch((err)=>{
            console.log("allready saved bookmark")
            return res.send("all ready saved bookmark")
        })
        
    })
    

    // all bookmark fronted api
    feed.get('/all_bookmark', (req,res)=>{
        knex('bookmark').join('blog_table', 'bookmark.blog_id', '=', 'blog_table.id')
        .then((data)=>{
            
            console.log(data)
            console.log("all show bookmark and show only one tamplate")
            return res.render(__dirname +'/views/login_home.ejs', {data: data});
        })
        .catch((err)=>{
            console.log(err)
        })
    })


    // folowers backend api
    feed.get('/follow', (req,res)=>{
        knex('follow').insert({email: req.query.email})
        .then((data)=>{ 
            console.log("insert bookmark successfully")
            return res.send("followers saved successfully!")
        }).catch((err)=>{
            console.log(err)
            return res.send("id not pass")
        })
    })


    // following backend api
    feed.get('/following', (req,res)=>{
        knex.select('*').distinct().from('follow').join('users', 'follow.email', '=', 'users.email')
        .then((data)=>{
            console.log(data)
            console.log("all show bookmark and show only one tamplate")
            return res.render(__dirname +'/views/follow.ejs', {data: data});
        })
        .catch((err)=>{
            console.log(err)
        })
    })


    // followers backend api
    feed.get('/following', (req,res)=>{
        knex.select('*').distinct().from('follow').join('users', 'follow.email', '=', 'users.email')
        .then((data)=>{
            console.log(data)
            console.log("all show bookmark and show only one tamplate")
            return res.render(__dirname +'/views/follow.ejs', {data: data});
        })
        .catch((err)=>{
            console.log(err)
        })
    })



    //image upload in aws backend api
    // feed.use(fileupload({ safeFileNames: true, preserveExtension: true }));
    // aws.config = {
    //     region: "ap-south-1",
    //     accessKeyId: "AKIARUNIPQAIT6C6ZVE2",
    //     secretAccessKey: "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",
    // };
    // var s3 = new aws.S3();

    // feed.use(fileupload({ safeFileNames: true, preserveExtension: true }));

//     feed.post("/new", (req, res) => {
//         var image_url=req.body
//         console.log(image_url)
//         console.log(req.files)
//         console.log("new api is working")
//         if (req.files) {
//             console.log("aijajkhan")
//             var params = {
//                 Bucket: "navgurukul",
//                 Key: "Aijaj/" + req.files.image_url,
//                 Body: req.files.image.data,
//                 ACL: "public-read",
//             };
//             console.log("file uploading.....");
//             s3.putObject(params, (err, data) => {
//                 if (!err) {
//                     var url= "https://nondejslearn.s3.ap-south-1.amazonaws.com/Aijaj/"+req.files.image_url
//                     console.log(url)
//                     res.send({ Done: "Success...", URL: url });
//                 }else{
//                     console.log(err);
//                 }
//             });
//         }else {
//             res.send("Please Select Image again.....");
//         }
//     });
// }




}
