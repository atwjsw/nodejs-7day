//目录遍历
var fs = require('fs');
var path = require('path');

function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);

        if (fs.statSync(pathname).isDirectory()) {
            travel(pathname, callback);
        } else {
            callback(pathname);          
        }
    });
}

function callback(pathname) {
	console.log(pathname);
}

travel("C:\\Users\\ewendia\\Documents\\Ericsson 20160530\\4 Knowledge Development\\69 nodejs-7-day\\002-package", callback);