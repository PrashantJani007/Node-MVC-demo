const express = require('express');
var expressBusboy = require('express-busboy');
const app = express();
const db = require('./models');
var  fs = require ( 'fs' );
const cookieParser = require('cookie-parser');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
var  uuid = require ( 'uuidv4' );

var  multipart = require ( 'connect-multiparty' );
var  multipartMiddleware = multipart ();

//WEB AUTH MIDDLEWARES
const auth = require('./middleware/auth');
const guest = require('./middleware/guest');

//API AUTH MIDDLEWARES
const authUser = require('./middleware/api/authApi');

var  orifilepath;
var  orifilename;
var  srvfilename;
var  newPath;

app.delete('/remove-extra-blog-image',(req,res)=>{
    if(newPath != undefined){
        fs.unlinkSync(newPath);
        return res.status(200).json({status:true,message:'Removed extra image!'});
    }else{
        return res.status(400).json({status:false,message:'No Image!'});
    }
});

app.post('/upload' , multipartMiddleware , function ( req , res ) {
    console.log(req.files);
    // console.log(__dirname,process.cwd());
    orifilepath = req . files . upload . path ;
    orifilename = req . files . upload . name ;
    srvfilename = Date.now()+ path . extname ( orifilename );
    fs . readFile ( orifilepath , function ( err , data ) {
        newPath = process.cwd() + '/storage/images/myblogimages/' + srvfilename ;
        fs . writeFile ( newPath , data , function ( err ) {
            if ( err ) console . log ({ err:  err });
            else {
                res.status(200).json({
                    uploaded: true,
                    url: `/storage/images/myblogimages/${srvfilename}`,
                });
            }
        });
    });
});

//USE MIDDLEWARE
expressBusboy.extend(app,{
    upload:true
});

//SYNCING DB
db.sequelize.sync().then(()=>{
    console.log("All Model Syncing!");
}).catch((err)=>{
    console.log(err);
});

//WEB ROUTES
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const usersRoutes = require('./routes/users');
const locationRoutes = require('./routes/locations');
const blogRoutes = require('./routes/blogs');
const contactRoutes = require('./routes/contacts');
const forgotPasswordRoutes = require('./routes/forgotPassword');
//API ROUTES
const authApiRoutes = require('./routes/api/auth');
const userApiRoutes = require('./routes/api/users');
const locationApiRoutes = require('./routes/api/locations');
const contactApiRoutes = require('./routes/api/contacts');
const blogApiRoutes = require('./routes/api/blogs');

app.use(cookieParser());
app.set('view engine','ejs');
app.use(expressLayout);
app.set('layout',__dirname+"/views/layout");
app.set('views',__dirname+"/views/admin");

app.use(express.static(path.join(__dirname,"public")));
app.use('/storage/images/', express.static(process.cwd() + '/storage/images/'))

app.set("layout forgotPassword", false);
//CALLING WEB ROUTES
app.use('/',authRoutes);
app.use('/',forgotPasswordRoutes);
app.use('/admin',auth,usersRoutes);
app.use('/admin',auth,dashboardRoutes);
app.use('/admin',auth,locationRoutes);
app.use('/admin',auth,blogRoutes);
app.use('/admin',auth,contactRoutes);

//CALLING API ROUTES
app.use('/api',authApiRoutes);
app.use('/api',contactApiRoutes);
app.use('/api',blogApiRoutes);
app.use('/api',authUser,userApiRoutes);
app.use('/api',authUser,locationApiRoutes);

app.set("layout login", false);

app.get('/',guest,(req,res)=>{
    res.render('login',{layout:'login'});
});

app.get('*', function(req, res){
    res.status(404).send('Page Not Found');
});

// app.post('/upload' , multipartMiddleware , function ( req , res ) {

//     // console.log(__dirname,process.cwd());

//     var  orifilepath = req . files . upload . path ;
//     var  orifilename = req . files . upload . name ;
//     var  srvfilename = Date.now()+ path . extname ( orifilename );
//     fs . readFile ( orifilepath , function ( err , data ) {
//         var  newPath = process.cwd() + '/storage/images/myblogimages/' + srvfilename ;
//         fs . writeFile ( newPath , data , function ( err ) {
//             if ( err ) console . log ({ err:  err });
//             else {
//                 // html = "{ \" filename \" : \" " + orifilename + " \" , \" uploaded \" : 1, \" url \" : \" /uploads/" + srvfilename + " \" }"
//                 // console.log ( html )
//                 return res.status(200).json({message:'Success'});
//             }
//         });
//     });
// });


app.listen(4001,()=>{
    console.log('Server running on port 4000');
});