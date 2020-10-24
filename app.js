var express     = require("express"),
 app         = express(),
 bodyParser  = require("body-parser"),
 mongoose    = require("mongoose")

mongoose.connect('mongodb://localhost:27017/ustttyertywereg',
{
	useNewUrlParser:true,
	useUnifiedTopology:true
})
.then(() => console.log("Connected to DB"))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var count=0;
var count2=0;
var count3=0;
var countuser;
var name, phone, aadharcard, email,date,area, city, plastic, dry, wet, electronic;

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

var Users=mongoose.model("Users",UserSchema)

var OrderSchema = new mongoose.Schema({
   customerId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
   name: String,
   date: Date,
   time: String,
   area: String,
   status: { type: String, default: 'order_placed'},
   createdAt: { type: Date, default: Date.now },
});

var Order = mongoose.model("Order",OrderSchema)

app.get("/",function(req,res){
	res.render("landing");
});

app.get("/signup",function(req,res){ //to signup
	res.render("signup");
})

app.get("/login",function(req,res){ //to signup
	res.render("login");
})

app.post("/post",function(req,res){
	Users.countDocuments({},function(err,c){
	if(err){
		console.log(err);
	}
	else{
		countuser=c;
	}
	});
	Users.find({},function(err,checkUser){
		if(err){
			console.log(err);
		}
		else{
			for(var i=0;i<countuser-1;i++){
				if(checkUser[i].username===req.body.username){
					count2++;
					res.render("signupuser");
					break;
				}
			}
			if(count2==0){
				if(req.body.password!==req.body.password2){
					res.render("signuppass");
				}
				else{
					Users.create({
						username:req.body.username,
						password:req.body.password
					},function(err,user){
						if(err){
							console.log(err);
						}
						else{
							res.redirect("/services");
						}
					})
				}					
			}
		}
	});
});

app.post("/logininfo",function(req,res){
	if(req.body.username=="admin"){
		if(req.body.password=="admin1234"){
			res.redirect("/admin");
		}
	}
	else{
		Users.countDocuments({},function(err,c){
			if(err){
				console.log(err);
			}
			else{
				countuser=c;
			}
		});
		Users.find({},function(err,checkUser){
			if(err){
				console.log(err);
			}
			else{
				for(var i=0;i<countuser;i++){
					if(checkUser[i].username===req.body.username){
						count3=count3+1;
						if(checkUser[i].password===req.body.password){
							res.redirect("/services");
							break;
						}
						else{
							res.render("loginpass");
							break;
						}
					}
				}
				if(count3==0){
					res.render("loginuser");
				}
			}
		});
	}
});


app.get("/services",function(req,res){
	res.render("services");
});

app.get("/pricing",function(req,res){
	res.render("pricing");
});

app.get("/contactus",function(req,res){
	res.render("contactus");
});

app.get("/pickup",function(req,res){
	res.render("pickup");
});

app.post("/pickup",function(req,res){
	name=req.body.name;
	phone=req.body.phonenumber;
	aadharcard=req.body.aadhar;
	email=req.body.email;
	date=req.body.date;
	area=req.body.area;
	city=req.body.city;
	plastic=req.body.plastic;
	dry=req.body.dry;
	wet=req.body.wet;
	electronic=req.body.electronic;
	
	var newOrder={name:name, area: area, date: date};
	
	Order.create(newOrder,function(err,newlyCreated){
		if(err)
			throw(err);
		else{
			console.log(newlyCreated);
			res.redirect("/submitted");
		}
	})
	
    var aadhar = req.body.aadhar;
    if (aadhar != '' && aadhar.length==14) {
			if(aadhar.substring(0,1)!==0 && aadhar.substring(0,1)!==1 ){
				var numbers = /^[0-9]+$/;
				var aadhar2=aadhar.substring(0,4)+aadhar.substring(5,9)+aadhar.substring(10);
				if(aadhar2.match(numbers)){
				   if(aadhar.substring(4,5)=='-' && aadhar.substring(9,10)=='-' ){
					   count++;
					   res.redirect("/submitted");
					}
					else{
						res.render("pickup2");//redirect to a page saying wrong aadhar card number
					}
				}
				else{
					res.render("pickup2");//redirect to a page saying wrong aadhar card number
				}
        	}
			else{
				res.render("pickup2"); //redirect to a page saying wrong aadhar card number
			}
    }
	else{
		res.render("pickup2");//redirect to a page saying wrong aadhar card number
	}
})

app.get("/submitted",function(req,res){
	res.render("services2");
})

app.get("/track",function(req,res){
	res.render("track");
});

app.get("/admin",function(req,res){
	console.log(req.body);
	Order.findById(req.params.id, function(err,order){
		if(err)
			throw(err);
		else{
			res.render("admin", {order:order});
		}
	});
})

app.listen(process.env.PORT, process.env.IP, function() { 
    console.log("Website has started!!"); 
});
