var util = require('util'); 
var pkg = require('./lib/main');
var cat = pkg.create("nodejs");
console.log(util.inspect(cat));