//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const alert = require("alert");

//Mongoose encryption 
const encrypt = require("mongoose-encryption");

const port = 3000;

//create express application
const app = express();
app.set('view engine', 'ejs');


//to initialize Express app to facilitate passing of form data
app.use(bodyParser.urlencoded({extended: true}));

//To display all static resources
app.use(express.static("public"));


//Mongo DB Implementation
// Database Name
 const dbName = 'usersDB';

//Connect to mongo db port at DB Name or create new DB if DB does not exist
mongoose.connect(process.env.URI + dbName).catch(error => handleError(error));



//User Schema creation
// const userSchema = {
//     username: {type: String},
//     password: {type: String}
// };

//More Standardly accepted schema
const userSchema = new mongoose.Schema({ _id: {type: String}, username: {type: String},
    password: {type: String}});


    //Create secret string for encrytpion and encrypt Password

    userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});


//User Model Creation
const User = mongoose.model("user", userSchema);


app.listen(port, function() {
    console.log("Server started on port", port);
  });

//GET Route
app.get("/", function(req, res){
    res.render("home");
});

//GET Route
app.get("/login", function(req, res){
    res.render("login");
});


//GET Route
app.post("/login", function(req, res){
    User.findOne({username: req.body.username}, function(err, foundUser){
        if(!err){
                //Verify User email
            if(foundUser){
                //Then verify Password
                if(foundUser.password === req.body.password){
                    console.log(foundUser.password);
                    res.render("secrets");
                }
                else{
                    //alert("Invalid Password or Username!!!");
                    console.log("Invalid Password or Username!");
                    res.render("login");
                }
            }
            else{
                //alert("Invalid Password or Username!!!");
                console.log("Invalid Password or Username");
                res.render("login");
            }

        }
        else{
            console.log("Login Error 2-->" + err);
        }
    });
});

//GET Route
app.get("/register", function(req, res){
    res.render("register");
});

//Post Route (Registration Form)
app.post("/register", function(req, res){
    const newUser = new User({_id:req.body.username, username: req.body.username,
    password: req.body.password});
    
    newUser.save(function(err){
        if(err){
            console.log("registration Error 1 -->" + err);
        }
        else{
            //popup.alert("Registration successful!!!");
            console.log("Registration Successfull!!!");
            res.render("login");
        }
    });
});
