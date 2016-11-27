var util = require('util'); 
var pkg = require('./002-package');
var cat = pkg.create("nodejs");
console.log(util.inspect(cat));