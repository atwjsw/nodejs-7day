var fs = require('fs');
var pathname = "C:\\Users\\Public\\Videos\\Sample Videos\\Wildlife.wmv";
var rs = fs.createReadStream(pathname);

rs.on('data', function (chunk) {
    console.log(chunk);
});

rs.on('end', function () {
    console.log('cleanUp()');
});

//豆知识： Stream基于事件机制工作，所有Stream的实例都继承于NodeJS提供的EventEmitter。