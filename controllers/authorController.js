var Author = require('../models/author');
var Book = require('../models/book');

var async = require('async');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Authors.
exports.author_list = function(req, res) {
	
	Author.find()
		.sort([['family_name', 'ascending']])
		.exec(function(err, list_authors){
			if(err) {return next(err);}
			// Successful, so render
			res.render('author_list', {title: 'Autor List', author_list: list_authors });
		});
};

// Display deatil page for a specific Author.
exports.author_detail = function(req, res, next) {
	
	async.parallel({
		author: function(callback) {
			Author.findById(req.params.id)
			.exec(callback)
		},
		authors_books: function(callback) {
			Book.find({ 'author': req.params.id},'title summary')
			.exec(callback)
		},
	}, function (err, results) {
		if(err) { return next(err); } // Error in API usage.
		if (results.author==null) {// No results.
			var err = new Error('Author not found');
			err.status = 404;
			return next(err);
		}
		// Succesful, so render.
		res.render('author_detail', {title: 'Author Detail', author: results.author, author_books: results.authors_books });
	});
};

// Display Author create form on GET.
exports.author_create_get = function(req,  res) {
	res.render('author_form', { title: 'Create Author'});
}

// Handle Author create on POST.
exports.author_create_post = [

	// Validate fields.
	body('first_name').isLength({min: 1 }).trim().withMessage('First name must be specified.')
	.isAlphanumeric().withMessage('First name has non-alphannumeric characters.'),
	body('family_name').isLength({min: 1 }).trim().withMessage('Family name must be specified.')
	.isAlphanumeric().withMessage('Family name has non-alphannumeric characters.'),
	body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true}).isISO8601(),
	body('date_of_death', 'Invalid date of death').optional({checkFalsy: true}).isISO8601(),
	
	//Sanitize fields.
	sanitizeBody('first_name').trim().escape(),
	sanitizeBody('family_name').trim().escape(),
	sanitizeBody('date_of_birth').toDate(),
	sanitizeBody('date_of_death').toDate(),
	
	//Process request after validation an sanitization.
	(req, res, next) => {
		
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		
		if(!errors.isEmpty()) {
			//There are errors. Render the form again with sanitized values/error messages.
			res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array()});
			return;
		}
		else {	
			// Data form form is valid.
		
			// Create a Author object with escaped and trimmed data.
			var author = new Author(
				{ 
					first_name: req.body.first_name,
					family_name: req.body.family_name,
					date_of_birth: req.body.date_of_birth,
					date_of_death: req.body.date_of_death
				});
		
			//save the Author
			author.save(function (err) {
				if (err) { return next(err); }
				// Succesful - Author saved. Redirect to author detail page.
				res.redirect(author.url);
			});
		}
			
	}

]

//Disply Author delete form on Get.
exports.author_delete_get = function(req, res) {
	res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
	res.send('NOT IMPLEMENTED: Author delete POST');
};

//Display Author update form on GET.
exports.author_update_get = function(req, res) {
	res.send('NOT IMPLEMENTED: Author update  GET');
};

// Handle Author updte on POST.
exports.author_update_post = function(req, res) {
	res.send('NOT IMPLEMENTED: Author update POST');
};