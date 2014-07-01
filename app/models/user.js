var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	name : String,
	teacher : Boolean,
	bio : String,
	classroomIds : [{ type: Schema.ObjectId, ref: 'Classroom' }],  //classrooms user is allowed into
	//discussionIds : [{ type: Schema.ObjectId, ref: 'Discussion' }], //discussions the user started
	//commentIds : [{ type: Schema.ObjectId, ref: 'Comment' }] //comments the user made
	//username: String might be generated through authentication service
	//password add with authentication service
});

module.exports = mongoose.model('User', userSchema);