//Import the mongoos module
var mongoose = require('mongoose');

//Set up default monggoose connection
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB);
//Get Mongoose to use the global promise library
mongoose.Promise = globla.Promise;
//Get the default conneciton
var db = mongoos.connection;

//Bind connection to error event(to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Define a schema
var Schema = mongoose.Schema;

var SomeModelSchema = new Schema({
	a_string: String,
	a_date: Date
});

var SomeModel = mongoose.model('SomeModel', SomeModelSchema );

var schema = new Schema(
{
	name: String,
	binary: Buffer,
	living: Boolean,
	update: { type: Date, default: Date.now() },
	age: { type: Number, min: 18, max: 65, required: true },
	mixed: Schema.Types.Mixed,
	_someId: Schema.Types.ObjectId,
	array: [],
	ofString: [String], //You can also have an array of each of the other types too.
	neasted: {stuff: {type: String, lowercase: true, trim: true}}
})

var breakfastSchema = new Schema({
	eggs: {
		type: Number,
		min: [6, 'Too few eggs'],
		max: 12,
		required: [true, 'Why no eggs?']
	},
	dring: {
		type: String,
		enum: ['Coffe', 'Tea', 'Water',]
	}
})

//Create an instance of model SomeModel
var awsome_instance = new SomeModel({name: 'awsome'});

//Save the new model instance, passing a callback
awesome_instance.save(function(err) {
	if (err) return handlerError();
	// saved!
}

SomeMoler.create({ name: 'also_awsome' }, function (err, awsome_instance){
	if(err) return handlerError(err);
	
	// Access model field values using dot notation
	console.log(awesome_instance.name);// should log 'also_awsome'

	//change record by modifing the fileds, then calling save().
	awesome_instance.name = "New cool name";
	awesome_instance.save(function (err){
		if (err) return handleError(err);
		// saved!
	});
	
});


var Athlete = mongoose.model('Athlete', yourSchema);

// find all atheltes who play tennis, selecting the 'name' and 'age' fileds
Athlete.find({'sport': 'Tenis' }, 'name age', function (err, athlets) {
	if(err) return handleError(err);
	// 'athletes' contains the list of athlets that match the criteria.
});

// find all athletes that play tennis
var query = Athlete.find({ 'sport': 'Tennis' });

// selecting the 'name' an 'age' fileds
query.select('name age');

// limit our result to 5  items
query.limit(5);

// sort by age
query.sort({age: -1});

//execute he query at a later time
query.exec(function (err, athletes) {
	if (err) return handleError(err);
	//athletes contains an orderd list of 5 athletes who play Tennis
});

Athlete.
	find().
	where('sport').equals('Tennis'),
	where('age').gt(17).lt(50). // Additional where query
	limit(5).
	sort({age: -1}).
	select ('name age').
	exec(callback); // where callbak is the name of our callbac function

var callback = function(err, athletes) {
	if (err) return handleError();
	//athletes contains an orderd list of 5 athletes who play Tennis
}


//working with related documents:
var authorSchmea = Schema({
	name	: String,
	stories	: [{type: Schma.Types.ObjectId, ref: 'Story' }]
});

var storySchema = Schema({
	author	: { type: Schema.Types.ObjectId, ref: 'Author' },
	title	: String
});

var Story = mongoose.model('Story', storySchema);
var Author = mongoose.model('Autyor', authorSchema);

var bob = new Author({ name: 'Bob Smith' });

bob.save(funciton(err) {
	if (err) return handlerError(err);
	
	//Bob now exist, so lets create a story
	var story = new Story({
		title: "Bob goes sledding",
		author: bob._id // assign the _id from our author Bob. this ID is created by default!
	});
	
	story.save(function (err) {
		if (err) return handleError()
		// Bob now has  his story
	});
});

Story
.findOne({ title: Bob goes sedding' })
.populate('author') //This populates the author id with actual author information!
.exec(function (err, story) {
	if (err) return handleErr(err);
	
	console.log('The author is %s', story.author.name);
	// prints "The author is Bob Smith"
});

Story
.find({ author : bob._id })
.exec(function (err, stories) {
	if (err) return handleError(err);
	// return all stories that have bob's id as thaer author.
}

/****************************************/
// create schema / model per file:
// File: ./models/somemodel.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var SomeModelSchema = new Schema({
  a_string          : String,
  a_date            : Date,
});

//Export function to create "SomeModel" model class
module.exports = mongoose.model('SomeModel', SomeModelSchema );
/*****************************************/
//Create a SomeModel model just by requiring the module
var SomeModel = require('../models/somemodel')

// Use the SomeModel object (model) to find all SomeModel records
SomeModel.find(callback_function);
/*****************************************/

