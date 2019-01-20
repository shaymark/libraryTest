// wiki.js = Wiki route module

var express = require('express');
var router = express.Router();

// Home page route.
router.get('/', function (req,  res) {
	res.send('Wiki home page');
})

// About page route.
router.get('/about', function (req, res) {
	res.send('About this wiki');
})

module.exprorts = router;


/*******************/
// app.js file
var wiki = require('./wiki.js')
// ....
app.use('/wiki', wiki)

// use like this: /wiki/about

app.get('/user/:userId/books/:bookId', function (req, res) {
	// Access user Id via : req.params.userId
	// Access bookId viea : req.params.bookId
	res.send(req.params);
}

notepad++ authorController.js
notepad++ authorContoller.js