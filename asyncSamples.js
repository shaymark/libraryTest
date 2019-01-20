/*************************/

expots.some_model_count = function(req, res, next) {
	
	SomeModel.count({ a_modeld_field: 'match_value' }, function(err, count) {
		// .... do somting if ther is an err
		
		// On Success, render the result by passing count into the render fucntion (here, as the varible 'data');
		res.render('the_template', {data: count});
	});
	
}

/*************************/


async.paraller({
	one: function(callback) { ... },
	two: function(callback) { ... },
	...
	somthing_else: function(callback) { ... }
	},
	//optional callback
	runction(err, results) {
		// 'results' is now equal to: {one: 1, two: 2, ... , somption_else: some_value}
	}
);

async.series({ // in series Not Ordered!!!
	one: function(callback) { ... },
	two: function(callback) { ... },
	...
	somthing_else: function(callback) { ... }
	},
	//optional callback
	runction(err, results) {
		// 'results' is now equal to: {one: 1, two: 2, ... , somption_else: some_value}
	}
);

async.series([ // ins series Ordered 
	function(callback) {
		// do some stuff ...
		callback(null, 'one');
	}
	function(callback) {
		//do some stuff ...
		callback(null, 'two');
	}
],
// optional callback
	function (err, result) {
		// result is now equeal to ['one', 'two']
		}
);

async.waterfall([
	function(callback) {
		callback(null, 'null', 'one', 'two');
	},
	function(arg1, arg2, callback){
		// arg1 now equals 'one' and arg2 now equeals 'two'
		callback(null, 'three');
	}
	function(arg1,  callback) {
		// arg1 now equels 'three'
		callback(null, 'done');
	}
	], function(err, result) {
		// result now equals 'done'
	}
)