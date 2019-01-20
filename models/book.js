var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookSchema = new Schema(
  {
    title: {type: String, required: true},
	author: {type: Schema.Types.ObjectId, ref: 'Author', require: true},
	summary: {type: String, require: true},
	isbn: {type: String, require: true},
	genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}]
  }
);

// Virtual for book's URL
BookSchema
.virtual('url')
.get(function() {
	return '/catalog/book/' + this._id;
});

//Export model
module.exports = mongoose.model('Book', BookSchema);
