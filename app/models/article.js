var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
	classroomID : { type: Schema.ObjectId, ref: 'Classroom' },
	title : String,
	author : String,
	source : String,
	content : String,
	discussions : [Discussion]
});

var Discussion = new Schema({
	userID : { type: Schema.ObjectId, ref: 'User' },
	articleIndex : {
		startIDX : {type : Number, min : 0},
		endIDX : {type : Number, min : 1}
	},
	content : String,
	comments : [Comment]
});

var Comment = new Schema({
	userID : { type: Schema.ObjectId, ref: 'User' },
	content : String
});

module.exports = mongoose.model('Article', articleSchema);

