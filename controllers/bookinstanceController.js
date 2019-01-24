var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');

var async = require('async');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all BookInstance.
exports.bookinstance_list = function(req, res, next) {
	
	BookInstance.find()
		.populate('book')
		.exec(function (err, list_bookinstances) {
			if (err) { return next(err); }
			// Sucessful, so render
			res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: list_bookinstances});
		});
		
};

// Display deatil page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {
	
	
	BookInstance.findById(req.params.id)
	.populate('book')
	.exec(function (err, bookinstance) {
		if (err) { return next(err); }
		if (bookinstance== null) { // No results.
			var err = new Error('Book copy not found');
			err.status = 404;
			return next(err);
		}
		// Successful, so render.
		res.render('bookinstance_detail', {title: 'Book:', bookinstance: bookinstance});
	});
	
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req,  res, next) {
	
	Book.find({}, 'title')
	.exec(function(err, books) {
		if (err) { return next(err); }
		// Successful, so render.
		res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books});
	});
	
};

// Handle BookInstance on POST.
exports.bookinstance_create_post = [
	
	// Validate fileds
	body('book', 'Book must be sepcified').isLength({min: 1}).trim(),
	body('imprint', 'Imprint must be specified').isLength({min: 1}).trim(),
	body('due_back', 'invalid date').optional({checkFalsy: true}).isISO8601(),
	
	// Sanitized files (using wildcard).
	sanitizeBody('book').trim().escape(),
	sanitizeBody('imprint').trim().escape(),
	sanitizeBody('status').trim().escape(),
	//sanitizeBody('due_back').toDate(),
	
	// Process request after validation and sanitization.
	(req, res, next) => {
		
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		
		// Create a Book object with escaped and trimmed data.
		var bookinstance = new BookInstance(
			{ book: req.body.book,
			  imprint: req.body.imprint,
			  status: req.body.status,
			  due_back: req.body.due_back,
			}
		);
		
		if(!errors.isEmpty()) {
			//There are errors. Render the form again with sanitized values/error messages.
			
			// Get all books witch we can use for adding to our bookinstance.
			Book.find({}, 'title')
			.exec (function (err, books) {
				if(err) { return next(err);}
				// Successful, so render.
				console.log('book instance:', bookinstance.due_back)
				res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book_id, errors: errors.array(), bookinstance: bookinstance });
			});

			return;
		}
		else {
			// Data from form is valid.
			bookinstance.save(function (err) {
				if (err) { return next(err); }
				// successful - redirect to new book record.
				res.redirect(bookinstance.url);
			});
		}
			
	}

]

//Disply BookInstance delete form on Get.
exports.bookinstance_delete_get = function(req, res, next) {
	
	BookInstance.findById(req.params.id)
	.exec(function (err, bookinstance) {
		if(err) { next(err); }
		if(bookinstance == null) {
			// book instance not found
			return res.redirect('/catalog/bookinstances')
		}
		// render the book delete page
		res.render('bookinstance_delete', {title: 'Delete bookinstance', book_instance: bookinstance})
	});
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res, next) {
	
	BookInstance.findById(req.body.id)
	.exec(function (err, bookinstance) {
		if(err) { next(err); }
		if(bookinstance == null) {
			// book instance not found
			return res.redirect('/catalog/bookinstances');
		}
		// delete the bookinstance
		BookInstance.findByIdAndRemove(req.body.bookinstance_id, function deleteBookinstance(err){
			if(err) { return next(err);}
			// Success = go to bookinstance list
			res.redirect('/catalog/bookinstances')
		});
	});
};

//Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res, next) {
	
	async.parallel({
		bookinstance: function(callback){
			BookInstance.findById(req.params.id).exec(callback)
		},
		books: function(callback){
			Book.find({}, 'title').exec(callback)
		}
	}, function (err, results) {
		if(err){ return next(err)};
		if(results.bookinstance == null){
			// No found bookinstance
			return res.redirect('/catalog/bookinstances');
		}
		// reder the update form
		res.render('bookinstance_form', {title: 'update bookinstance', bookinstance: results.bookinstance, selected_book: results.bookinstance.book_id, book_list: results.books})
	});
};

// Handle BookInstance updte on POST.
exports.bookinstance_update_post = [
	
	// Validate fileds
	body('book', 'Book must be sepcified').isLength({min: 1}).trim(),
	body('imprint', 'Imprint must be specified').isLength({min: 1}).trim(),
	body('due_back', 'invalid date').optional({checkFalsy: true}).isISO8601(),
	
	// Sanitized files (using wildcard).
	sanitizeBody('book').trim().escape(),
	sanitizeBody('imprint').trim().escape(),
	sanitizeBody('status').trim().escape(),
	//sanitizeBody('due_back').toDate(),
	
	// Process request after validation and sanitization.
	(req, res, next) => {
		
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		
		// Create a Book object with escaped and trimmed data.
		var bookinstance = new BookInstance(
			{ book: req.body.book,
			  imprint: req.body.imprint,
			  status: req.body.status,
			  due_back: req.body.due_back,
			  _id: req.params.id
			}
		);
		
		if(!errors.isEmpty()) {
			//There are errors. Render the form again with sanitized values/error messages.
			
			// Get all books witch we can use for adding to our bookinstance.
			Book.find({}, 'title')
			.exec (function (err, books) {
				if(err) { return next(err);}
				// Successful, so render.
				console.log('book instance:', bookinstance.due_back)
				res.render('bookinstance_form', { title: 'Update BookInstance', book_list: books, selected_book: bookinstance.book_id, errors: errors.array(), bookinstance: bookinstance });
			});

			return;
		}
		else {
			// Update the book instance
			BookInstance.findByIdAndUpdate(req.params.id, bookinstance, function (err, theBookinstance) {
				if (err) { return next(err); }
				// Succesful - Redirect to book instance detail page.
				res.redirect(theBookinstance.url);
			});
		}
			
	}

]