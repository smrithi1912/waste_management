var express = require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
mongoose.connect('mongodb://localhost:27017/uspoyt',
{
	useNewUrlParser:true,
	useUnifiedTopology:true
})
.then(() => console.log("Connected to DB"))
.catch(error => console.log(error.message));

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

var Users=mongoose.model("Users",UserSchema);

app.get("/user",function(req,res){
	res.render("signup");
})

app.post("/post",function(req,res){
	var count=0;
	var countuser;
	Users.find({}, function(err,users){
		if(err){
			console.log(err);
		}
		else{
			Users.countDocuments({},function(err,c){
				if(err){
					console.log(err);
				}
				else{
					countuser=c;
					console.log(countuser);
				}
			});
			for(var i=0;i<countuser;i++){
				if(users[i].username===req.body.username){
					res.render("signupuser");
					count++;
					break;
				}
			}
			if(count==0){
				if(req.body.password!==req.body.password2){
					res.render("signuppass");
				}
				else{
					Users.create({
							username:req.body.username,
							password:req.body.password,	 
					})
					res.redirect("/home");
				}
			}
		}
});
});

app.get("/login",function(req,res){
	res.render("login");
});

app.post("/logininfo",function(req,res){
	var count1=0;
	Users.find({}, function(err,users){
		if(err){
			console.log(err);
		}
		else{
			for(var i=0;i<Users.length;i++){
				if(users[i].username===req.body.username){
					count1++;
					if(users[i].password===req.body.password){
						res.redirect("/home");
					}
					else{
						res.render("loginpass");
					}
				}
			}
			if(count1==0){
				res.render("loginuser");
			}
		}
	});
})		

Users.find({}, function(err,users){
	if(err){
		console.log(err);
	}
	else{
		console.log(users);
	}
});

app.listen(process.env.PORT, process.env.IP, function() { 
    console.log("Website has started!!"); 
});
