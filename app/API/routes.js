var express = require('express');
var User = require('../models/user');
var Classroom = require('../models/classroom');
var Article = require('../models/article');
var mongoose = require('mongoose');

module.exports = (function() {
	'use strict';
	var api = express.Router();

	api.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

	api.get('/', function(req, res) {
		console.log('accessed by browser')
		res.send('some json');
	});
//===============Users===========================================================
	api.post('/users', function(req, res) {
		var user = new User();
		user.name = req.body.name;
		user.teacher = req.body.teacher;
		user.bio = req.body.bio;
		user.classroomIds = req.body.classroomIds;
		user.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'User created!' });
		});
	});
	api.get('/users', function(req, res) {
		User.find(function(err, users) {
			if (err)
				res.send(err);
			res.send(users);
		});
	});
	api.get('/users/:userID', function(req, res) {
		User.findById(req.params.userID, function(err, user) {
			if (err)
				res.send(err);
			res.send(user);
		});
	});
	api.put('/users/:userID', function(req, res) {
		User.findById(req.params.userID, function(err, user) {
			if (err)
				res.send(err);
			user.name = req.body.name;
			user.teacher = req.body.teacher;
			user.bio = req.body.bio;
			user.classroomIds = req.body.classroomIds;
			user.save(function(err) {
				if (err)
					res.send(err);
				res.json({message: 'User updated!'});
			});

		});
	});
	api.delete('/users/:userID', function(req, res) {
		User.remove({
			_id: req.params.userID
		}, function(err, user) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});
//==========================Classrooms=======================================
	api.post('/classrooms', function(req, res) {
		var classroom = new Classroom();
		classroom.classroomName = req.body.classroomName;
		classroom.articles = req.body.articles;
		classroom.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Classroom created!' });
		});
	});

	api.get('/classrooms', function(req, res) {
		Classroom.find(function(err, classrooms) {
			if (err)
				res.send(err);
			res.send(classrooms);
		});
	});


	api.get('/classrooms/:classroomID', function(req, res) {
		Classroom.findById(req.params.classroomID, function(err, classroom) {
			if (err)
				res.send(err);
			res.send(classroom);
		});
	});

	api.put('/classrooms/:classroomID', function(req, res) {
		Classroom.findById(req.params.classroomID, function(err, classroom) {
			if (err)
				res.send(err);
			classroom.classroomName = req.body.classroomName;
			classroom.articles = req.body.articles;
			classroom.save(function(err) {
				if (err)
					res.send(err);
				res.json({message: 'Classroom updated!'});
			});

		});
	});

	api.delete('/classrooms/:classroomID', function(req, res) {
		Classroom.remove({
			_id: req.params.classroomID
		}, function(err, classroom) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});
//=====================Article==================================================
	api.post('/classrooms/:classroomID/articles', function(req, res) {
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

	api.get('/classrooms/:classroomID/articles', function(req, res) {
		Classroom.findById(req.params.classroomID, function(err, classroom) {
			if (err)
				res.send(err);
			var articles = classroom.articles;
			var i;
			for(i=0; i<articles.length; i++) {
				Article.findById(articles[i], function(err, article) {
					if (err)
						res.send(err);
					res.send(article);
				})
			}
			
		});
	});

	api.get('/classrooms/:classroomID/articles/:articleID', function(req, res) {
		Classroom.findById(req.params.classroomID, function(err, classroom) {
			if (err)
				res.send(err);
			var articles = classroom.articles;
			Article.findById(req.params.articleID, function(err, article) {
				if (err)
					res.send(err);
				res.send(article);
			})
			
		});
	});

	api.put('/classrooms/:classroomID/articles/:articleID', function(req, res) {
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
	api.delete('/classrooms/:classroomID/articles/:articleID', function(req, res) {
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

//=========================Discussions==================================================

	api.post('/classrooms/:classroomID/articles/:articleID/discussions', function(req, res) {
		Article.findById(req.params.articleID, function(err, article) {
			if (err)
				res.send(err);
			article.discussions.push({content:"weeeee"});
			
			
			article.save(function(err) {
				if (err)
					res.send(err);
				res.json({message : "discussion added!"});
			});
		});
	});

	api.get('/classrooms/:classroomID/articles/:articleID/discussions', function(req, res) {
		Article.findById(req.params.articleID, function(err, article) {
			if (err)
				res.send(err);
			var d = article.discussions;
			res.send(d);
		});
	});

	api.get('/classrooms/:classroomID/articles/:articleID/discussions/:discussionID', function(req, res) {
		Article.findById(req.params.articleID, function(err, article) {
			if (err)
				res.send(err);
			var d = article.discussions[req.params.discussionID];
			res.send(d);
		});
	});
/*
	api.put('/classrooms/:classroomID/articles/:articleID/discussions/:discussionID', function(req, res) {
		db.Article.discussions.save(
   {
     _id: req.params.discussionID,
     startIDX: req.body.startIDX,
     endIDX: req.body.endIDX,
     content: req.body.content
   }
)
	})

*/
	api.delete('/classrooms/:classroomID/articles/:articleID/discussions/:discussionID', function(req, res) {
		Article.findById(req.params.articleID, function(err, article) {
			if (err)
				res.send(err);
			article.discussions[req.params.discussionID].remove();
			article.save(function(err) {
				if (err)
					res.send(err);
				res.json({message: "discussion deleted!"})
			})
		})
	})
	return api;
})();