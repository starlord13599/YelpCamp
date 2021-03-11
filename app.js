var express = require('express');
var app = express();
var mongoose = require('mongoose');
var BodyParser = require('body-parser');
var passport = require('passport');
var passportlocal = require('passport-local');
var flash = require('connect-flash');
var mongoosepassportlocal = require('passport-local-mongoose');
var methodOverride = require('method-override');
var SeedDB = require('./seeds');
var Campgrounds = require('./models/campground');
var Comment = require('./models/comments');
var User = require('./models/User');
mongoose.connect('mongodb://localhost/YelpCamp', {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useFindAndModify: true
});
app.use(
	BodyParser.urlencoded({
		extended: true
	})
);

app.use(
	require('express-session')({
		secret: 'XDRTYHGFGG',
		resave: false,
		saveUninitialized: false
	})
);
/* app.use(express.static(__dirname + '/public')); */
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
/* SeedDB(); */

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportlocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use(function (req, res, next) {
	res.locals.currentuser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});
//==========================
//ROUTES
//==========================

app.get('/', function (req, res) {
	res.render('home');
});

app.get('/campgrounds', function (req, res) {
	Campgrounds.find({}, function (err, newlyadd) {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds', {
				campg: newlyadd
			});
		}
	});
});

app.post('/campgrounds', function (req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var details = req.body.details;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newcg = {
		title: name,
		image: image,
		details: details,
		author: author
	};

	Campgrounds.create(newcg, function (err, newg) {
		if (err) {
			req.flash('error', 'not found');
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Successfully Added');
			res.redirect('/campgrounds');
		}
	});
});

app.get('/campgrounds/new', IsLogedin, function (req, res) {
	res.render('new');
});

app.get('/campgrounds/:id', function (req, res) {
	Campgrounds.findById(req.params.id).populate('comments').exec(function (err, foundCg) {
		if (err) {
			console.log(err);
		} else {
			res.render('info', {
				camp: foundCg
			});
		}
	});
});
//=======================
//EDIT
//=======================
app.get('/campground/:id/edit', check, function (req, res) {
	Campgrounds.findById(req.params.id, function (err, found) {
		if (err) {
			console.log(err);
		} else {
			res.render('edit', {
				campg: found
			});
		}
	});
});
app.put('/campgrounds/:id', function (req, res) {
	Campgrounds.findByIdAndUpdate(req.params.id, req.body.cg, function (err, updated) {
		if (err) {
			req.flash('error', 'Error Updating the post');
			res.redirect('/campground/' + req.params.id);
		} else {
			req.flash('success', 'Successfully Updated');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});
app.delete('/campground/:id', check, function (req, res) {
	Campgrounds.findByIdAndRemove(req.params.id, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			req.flash('success', 'Successfully removed');
			res.redirect('/campgrounds');
		}
	});
});

//=======================
//COMMENTS
//=======================

app.get('/campgrouds/:id/comments/new', IsLogedin, function (req, res) {
	Campgrounds.findById(req.params.id, function (err, campg) {
		if (err) {
			console.log(err);
		} else {
			res.render('commentnew', {
				campg: campg
			});
		}
	});
});

app.post('/campgrounds/:id/comment', function (req, res) {
	Campgrounds.findById(req.params.id, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			Comment.create(req.body.comment, function (err, create) {
				if (err) {
					console.log(err);
				} else {
					create.author.id = req.user._id;
					create.author.username = req.user.username;
					create.save();
					data.comments.push(create);
					data.save();
					res.redirect('/campgrounds/' + req.params.id);
				}
			});
		}
	});
});
//========================
//REGISTER ROUTES
//=======================
app.get('/register', function (req, res) {
	res.render('register');
});
app.post('/register', function (req, res) {
	User.register(
		new User({
			username: req.body.username
		}),
		req.body.password,
		function (err, data) {
			if (err) {
				req.flash('error', err.message);
				res.redirect('/register');
			} else {
				passport.authenticate('local')(req, res, function () {
					req.flash('success', 'Registered Successully');
					res.redirect('/campgrounds');
				});
			}
		}
	);
});
//============================
//LOGIN
//===========================
app.get('/login', function (req, res) {
	res.render('login');
});

app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}),
	function (req, res) {}
);
app.get('/logout', function (req, res) {
	req.logOut();
	req.flash('success', 'Logged you out');
	res.redirect('/');
});

//=======================
//MIDDLEWARE
//======================
function check(req, res, next) {
	if (req.isAuthenticated()) {
		Campgrounds.findById(req.params.id, function (err, found) {
			if (found.author.id.equals(req.user._id)) {
				if (err) {
					console.log(err);
				} else {
					next();
				}
			} else {
				res.redirect('/campgrounds');
			}
		});
	} else {
		res.redirect('back');
	}
}

function IsLogedin(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error', 'Login first');
		res.redirect('/login');
	}
}
//==================
//SERVER
//==================
app.listen(3000, function () {
	console.log('YelpCamp server has started');
});