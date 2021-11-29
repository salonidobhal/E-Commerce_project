var express=require('express');
var path=require('path');
var mongoose=require('mongoose');
var config=require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session')
var expressValidator = require('express-validator');
var fileUpload=require('express-fileupload');
var passport=require('passport');

//Connect to db
mongoose.connect(config.database);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected");
});

//init app
app=express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Set global errors variable
app.locals.errors=null;

//Get page model
var Page=require('./models/page');

//Get all pages to pass to header.ejs
Page.find({}).sort({sorting:1}).exec(function(err, pages)
{
	if(err)
		console.log(err);
	else{
		app.locals.pages=pages;
	}
})

//Get category model
var Category=require('./models/category');

//Get all pages to pass to header.ejs
Category.find(function(err, categories)
{
	if(err)
		console.log(err);
	else{
		app.locals.categories=categories;
	}
});



//Express FileUpload middleware
app.use(fileUpload());

//Body-parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Express session middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true }
}))
//Express validator middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root    = namespace.shift()
		, formParam = root;
  
	  while(namespace.length) {
		formParam += '[' + namespace.shift() + ']';
	  }
	  return {
		param : formParam,
		msg   : msg,
		value : value
	  };
	},
	customValidators:{
		isImage:function(value, filename)
		{
			var extension=(path.extname(filename)).toLocaleLowerCase();
			switch(extension)
			{
				case '.jpg':
					return '.jpg';
				case '.jpeg':
					return '.jpeg';
				case '.png':
					return '.png';
				case '':
					return '.jpg';
				default:
					return false;
			}
		}
	}
  }));

  //Express messages middleware
  	app.use(require('connect-flash')());
	app.use(function (req, res, next) {
  	res.locals.messages = require('express-messages')(req, res);
  	next();
});

//Passport config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next)
{
	res.locals.cart=req.session.cart;
	res.locals.user=req.user || null;
	next();
})

//Set routes
var pages=require('./routes/pages.js');
var products=require('./routes/products.js');
var cart=require('./routes/cart.js');
var users=require('./routes/users.js');
var adminPages=require('./routes/admin_pages.js');
var adminCategories=require('./routes/admin_categories.js');
var adminProducts=require('./routes/admin_products.js');
const { initialize } = require('passport');

app.use('/products', products);
app.use('/cart', cart);
app.use('/users', users);
app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);
app.use('/', pages);

//start the server
var port=3000;
app.listen(port, function()
{
    console.log("Server started at "+port);
})