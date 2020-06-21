// const app = require("express")();
// var fileupload = require("express-fileupload");
// aws = require("aws-sdk");


// app.use(fileupload({ safeFileNames: true, preserveExtension: true }));
// aws.config = {
//   region: "ap-south-1",
//   accessKeyId: "AKIARUNIPQAIT6C6ZVE2",
//   secretAccessKey: "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",
// };
// var s3 = new aws.S3();

// // app.post("/new", (req, res) => {
//   var imageurl=req.body.imageurl
//   if (req.files) {
//     var params = {
//       Bucket: "navgurukul",
//       Key: "Aijaj/" + req.files.,
//       Body: req.files.image.data,
//       ACL: "public-read",
//     };
//     console.log("file uploading.....");
//     s3.putObject(params, (err, data) => {
//       if (!err) {
//         var url= "https://nondejslearn.s3.ap-south-1.amazonaws.com/Aijaj/"+req.files.image.name
//         console.log(url)
//         res.send({ Done: "Success...", URL: url });
//       }else{
//         console.log(err);
//       }
//     });
//   }else {
//     res.send("Please Select Image again.....");
//   }
// });



// // app.listen(4000, () => {
// //   console.log(`Your Server is listening on port: ${4000}`);
// // });



