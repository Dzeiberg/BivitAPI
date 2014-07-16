 var User = require('../models/user');
 var Classroom = require('../models/classroom');
 var Article = require('../models/article');
 var Discussion = require('../models/discussion');
 var Comment = require('../models/comment');
 
 
 

module.exports = function(app, passport) {
//=========================USER==================================================================
	// HOME PAGE (with login links) ========
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// LOGIN ===============================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') }); 
	});

	// process the login form==================
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// SIGNUP ==============================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form==================
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// PROFILE SECTION =====================
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	//UPDATE USER=============
	app.put('/users/:userID', isLoggedIn, currentUser, passport.authenticate('local-update', {
		successRedirect : '/profile',
		failureRedirect : '/',
		failureFlash : true
	}));

	//DELETE USER=============
	app.delete('/users/:userID', isLoggedIn, currentUser, function(req, res) {
		User.remove({
			_id: req.params.userID
		}, function(err, user) {
			if (err)
				res.send(err);
			res.json({ message: 'Successfully deleted' });
		});
		res.redirect('/');
	});

	//GET ALL USERS================
	app.get('/users', isLoggedIn, function(req, res) {
		User.find(function(err, users) {
			if (err)
				res.send(err);
			res.send(users);
		});
	});

	//GET USER=====================
	app.get('/users/:userID', isLoggedIn, function(req, res) {
		User.findById(req.params.userID, function(err, user) {
			if (err)
				res.send(err);
			res.send(user);
		});
	});

//==============================Classroom===================================================
	app.post('/classrooms', isLoggedIn, function(req, res) {
		var classroom = new Classroom();
		classroom.classroomName = req.body.classroomName;
		classroom.articles = req.body.articles;
		classroom.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Classroom created!' });
		});
	});
	
	app.get('/classrooms', isLoggedIn, function(req, res) {
		Classroom.find(function(err, classrooms) {
			if (err)
				res.send(err);
			res.send(classrooms);
		});
	});

	app.get('/classrooms/:classroomID', isLoggedIn, function(req, res) {
		Classroom.findById(req.params.classroomID, function(err, classroom) {
			if (err)
				res.send(err);
			res.send(classroom);
		});
	});
	
	app.put('/classrooms/:classroomID', isLoggedIn, function(req, res) {
		Classroom.findById(req.params.classroomID, function(err, classroom) {
			if (err)
				res.send(err);
			classroom.classroomName = req.body.classroomName;
			classroom.save(function(err) {
				if (err)
					res.send(err);
				res.json({message: 'Classroom updated!'});
			});

		});
	});

	app.delete('/classrooms/:classroomID', isLoggedIn, function(req, res) {
		Classroom.remove({
			_id: req.params.classroomID
		}, function(err, classroom) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});
//==============================Article===========================================
	app.post('/classrooms/:classroomID/articles', isLoggedIn, function(req, res) {
		var article = new Article();
		article.classroomID = req.params.classroomID;
		article.title = req.body.title;
		article.author = req.body.author;
		article.source = req.body.source;
		article.content = req.body.content;
		article.save(function(err) {
			if (err)
				res.send(err);
			
		});
		Classroom.findById(req.params.classroomID, function(err, classroom) {
			if (err)
				res.send(err);
			classroom.articles.push(article);
			classroom.save(function(err) {
				if (err)
					res.send(err);
				res.json({message: 'Article created!'});
			});

		});
	});
	
	app.get('/classrooms/:classroomID/articles', isLoggedIn, function(req, res) {
		Article.find({'classroomID' : req.params.classroomID}, function(err, articles) {
			if (err)
				res.send(err);
			res.send(articles);
		});
	});
	
	app.get('/classrooms/:classroomID/articles/:articleID', isLoggedIn, function(req, res) {
		Article.findById(req.params.articleID, function(err, article) {
			if (err)
				res.send(err);
			res.send(article);
		});
	});
	
	app.put('/classrooms/:classroomID/articles/:articleID', isLoggedIn, function(req, res) {
		Article.findById(req.params.articleID, function(err, article) {
			if (err)
				res.send(err);
			article.classroomID = req.params.classroomID;
			article.title = req.body.title;
			article.author = req.body.author;
			article.source = req.body.source;
			article.content = req.body.content;
			article.save(function(err) {
				if (err)
					res.send(err);
				res.json({message: 'Article updated!'});
			});
		});
	});
	
	app.delete('/classrooms/:classroomID/articles/:articleID', isLoggedIn, function(req, res) {
		Article.remove({
			_id: req.params.articleID
		}, function(err, article) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
			Classroom.findById(req.params.classroomID, function(err, classroom) {
			if (err)
				res.send(err);
			classroom.articles.splice(classroom.articles.indexOf(article._id));
			classroom.save(function(err) {
				if (err)
					res.send(err);
			});

		});
		});
	});
//==============================Discussions============================================
	app.post('/classrooms/:classroomID/articles/:articleID/discussions', isLoggedIn, function(req, res) {
		var discussion = new Discussion();
		discussion.startIDX = req.body.startIDX;
		discussion.endIDX = req.body.endIDX;
		discussion.content = req.body.content;
		discussion.userID = req.user._id;
		discussion.save(function(err) {
			if (err)
				res.send(err);
			
		});
		Article.findById(req.params.articleID, function(err, article) {
			if (err)
				res.send(err);
			article.discussions.push(discussion);
			article.save(function(err) {
				if (err)
					res.send(err);
				res.json({message: 'Discussion created!'});
			});

		});
	});
		
	app.get('/classrooms/:classroomID/articles/:articleID/discussions', isLoggedIn, function(req, res) {
		Article.findById(req.params.articleID, function(err, article) {
			if (err)
				res.send(err);
			var d = article.discussions;
			Discussion.find({'_id': {$in: d}}, function(err, discussions) {
				if (err)
					res.send(err);
				res.send(discussions);
			})
		});
	});
	
	app.get('/classrooms/:classroomID/articles/:articleID/discussions/:discussionID', isLoggedIn, function(req, res) {
		Discussion.findById(req.params.discussionID, function(err, discussion) {
			if (err)
				res.send(err);
			res.send(discussion);
		})
	});
	
	app.put('/classrooms/:classroomID/articles/:articleID/discussions/:discussionID', isLoggedIn, function(req, res) {
		Discussion.findById(req.params.discussionID, function(err, discussion) {
			if (err)
				res.send(err);
			discussion.startIDX = req.body.startIDX;
			discussion.endIDX = req.body.endIDX;
			discussion.content = req.body.content;
			discussion.save(function(err) {
				if (err)
					res.send(err);
				res.json({message: "Discussion updated!"});
			})
		})
	})
	
	app.delete('/classrooms/:classroomID/articles/:articleID/discussions/:discussionID', isLoggedIn, function(req, res) {
		Discussion.remove({_id: req.params.discussionID}, function(err, discussion) {
			if (err)
				res.send(err);
			Article.findById(req.params.articleID, function(err, article) {
				if (err)
					res.send(err);
				article.discussions.splice(article.discussions.indexOf(discussion._id));
				article.save(function(err) {
					if (err)
						res.send(err);
					res.json({ message: 'Successfully deleted' });
				});

			});
		});
	})
//======================Comments===========================================================
	app.post('/classrooms/:classroomID/articles/:articleID/discussions/:discussionID/comments', isLoggedIn, function(req, res) {
		var comment = new Comment();
		comment.content = req.body.content;
		comment.userID = req.user._id;
		comment.save(function(err) {
			if (err)
				res.send(err);
		})
		Discussion.findById(req.params.discussionID, function(err, discussion) {
			if (err)
				res.send(err);
			discussion.comments.push(comment);
			discussion.save(function(err) {
				if (err)
					res.send(err);
				res.json({message: "Comment created!"})
			})
		})
	})
	
	app.get('/classrooms/:classroomID/articles/:articleID/discussions/:discussionID/comments', isLoggedIn, function(req, res) {
		Discussion.findById(req.params.discussionID, function(err, discussion) {
			if (err)
				res.send(err);
			var c = discussion.comments;
			Comment.find({'_id': {$in: c}}, function(err, comments) {
				if (err)
					res.send(err);
				res.send(comments);
			})
		});
	});
	
	app.get('/classrooms/:classroomID/articles/:articleID/discussions/:discussionID/comments/:commentID', isLoggedIn, function(req, res) {
		Comment.findById(req.params.commentID, function(err, comment) {
			if (err)
				res.send(err);
			res.send(comment);
		})
	});
	
	app.put('/classrooms/:classroomID/articles/:articleID/discussions/:discussionID/comments/:commentID', isLoggedIn, function(req, res) {
		Comment.findById(req.params.commentID, function(err, comment) {
			if (err)
				res.send(err);
			comment.content = req.body.content;
			comment.save(function(err) {
				if (err)
					res.send(err);
				res.json({message: "Comment updated!"});
			})
		})
	})
	
	app.delete('/classrooms/:classroomID/articles/:articleID/discussions/:discussionID/comments/:commentID', isLoggedIn, function(req, res) {
		Comment.remove({_id: req.params.commentID}, function(err, comment) {
			if (err)
				res.send(err);
			Discussion.findById(req.params.discussionID, function(err, discussion) {
				if (err)
					res.send(err);
				discussion.comments.splice(discussion.comments.indexOf(comment._id));
				discussion.save(function(err) {
					if (err)
						res.send(err);
					res.json({ message: 'Successfully deleted comment!' });
				});
			});
		});
	})
};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
function currentUser(req, res, next) {
	//console.log(req.user._id);
	//console.log(req.params.userID);
	if(req.user._id == req.params.userID)
		return next();
	console.log('Invalid credentials')
	res.redirect('/profile');
}

