var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Genre.
exports.genre_list = function(req, res) {
	Genre.find()
		.sort([['name', 'ascending']])
		.exec(function(err, list_genres){
			if(err) {return next(err);}
			// Successful, so render
			res.render('genre_list', {title: 'Genre List', genre_list: list_genres });
		});
};

// Display deatil page for a specific Genre.
exports.genre_detail = function(req, res) {
	
	async.parallel({
		genre: function(callback) {
			Genre.findById(req.params.id)
			.exec(callback);
		},
		
		genre_books: function(callback) {
			Book.find({ 'genre': req.params.id })
			.exec(callback);
		},
	}, function(err, results) {
		if(err) {return next(err); }
		if (results.genre==null) { // No results.
			var err = new Error('Genre not found');
			err.status = 404;
			return next(err);
		}
		//Successful, so render
		res.render('genre_detail', {title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
	});
	
};

// Display Genre create form on GET.
exports.genre_create_get = function(req,  res) {
	res.render('genre_form', { title: 'Create Genre' });
}

// Handle Genre create on POST.
exports.genre_create_post = [

	// Validate that the name field is not empty.
	body('name', 'Genre name required').isLength({ min: 1 }).trim(),

	// Sanitize (trim and escape) the name field.
	sanitizeBody('name').trim().escape(),
	
	//Process request after validation an sanitization.
	(req, res, next) => {
		
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		
		// Create a genre object with escaped and trimmed data.
		var genre = new Genre(
			{ name: req.body.name }
		);
		
		if(!errors.isEmpty()) {
			//There are errors. Render the form again with sanitized values/error messages.
			res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
			return;
		}
		else {
			//save the Genre
			genre.save(function (err) {
				if (err) { return next(err); }
				// Genre saved. Redirect to genre detail page.
				res.redirect(genre.url);
			});
		}
			
	}
	
]

//Disply Genre delete form on Get.
exports.genre_delete_get = function(req, res) {
	
	async.parallel({
		genre: function(callback) {
			Genre.findById(req.params.id)
			.exec(callback);
		},
		
		genre_books: function(callback) {
			Book.find({ 'genre': req.params.id })
			.exec(callback);
		},
	}, function(err, results) {
		if(err) {return next(err); }
		if (results.genre==null) { // No results.
			res.redirect('/catalog/genres');
			return next(err);
		}
		//Successful, so render
		res.render('genre_delete', {title: 'Genre Delete', genre: results.genre, genre_books: results.genre_books } );
	});
	
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
	
	async.parallel({
		genre: function(callback) {
			Genre.findById(req.body.genreid)
			.exec(callback);
		},
		
		genre_books: function(callback) {
			Book.find({ 'genre': req.body.genreid })
			.exec(callback);
		},
	}, function(err, results) {
		if(err) {return next(err); }
		if(results.genre_books.length > 0) {
			// Genre has books. Render in same way as for Get route.
			res.render('genre_delete', {title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books});
			return;
		} 
		else {
			//Genre has no books. Delete object and redirect to list of geners.
			Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
				if(err) { return next(err);}
				// Success = go to genre list
				res.redirect('/catalog/genres')
			});
		}
		
	});
	
};

//Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
	
	async.parallel({
		genre: function(callback) {
			Genre.findById(req.params.id)
			.exec(callback);
		},
		
	}, function(err, results) {
		if(err) {return next(err); }
		if (results.genre==null) { // No results.
			res.redirect('/catalog/genres')
			return next(err);
		}
		//Successful, so render
		res.render('genre_form', {title: 'Update Genre', genre: results.genre } );
	});
};

// Handle Genre updte on POST.
exports.genre_update_post = [

	// Validate that the name field is not empty.
	body('name', 'Genre name required').isLength({ min: 1 }).trim(),

	// Sanitize (trim and escape) the name field.
	sanitizeBody('name').trim().escape(),
	
	//Process request after validation an sanitization.
	(req, res, next) => {
		
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		
		// Create a genre object with escaped and trimmed data.
		var genre = new Genre(
			{ 
				name: req.body.name, 
				_id: req.params.id
			}
		);
		
		if(!errors.isEmpty()) {
			//There are errors. Render the form again with sanitized values/error messages.
			res.render('genre_form', { title: 'Update Genre', genre: genre, errors: errors.array()});
			return;
		}
		else {
			//Upate the Genre
			Genre.findByIdAndUpdate(req.params.id, genre, function (err, theGenre) {
				if (err) { return next(err); }
				// Succesful - Redirect to genre detail page.
				res.redirect(theGenre.url);
			});
		}
			
	}
	
]