var child_process = require('child_process');
var util = require('util');

function copy(source, target, callback) {
	console.log("copy begin");
    child_process.exec(
        util.format('cp -r %s/* %s', source, target), callback);
}

var src = "C:/Users/ewendia/tmp";
var dest = "C:/Users/ewendia/tmp1";

copy(src, dest, function (err) {
	if (err) {
		console.log(err);
	}
    console.log("copy completed");
});


// 使用NodeJS调用终端命令来简化目录拷贝，
// 从以上代码中可以看到，子进程是异步运行的，通过回调函数返回执行结果。