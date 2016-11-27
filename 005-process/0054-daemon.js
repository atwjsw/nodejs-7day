/* daemon.js */
var child_process = require('child_process');
function spawn(mainModule) {
    var worker = child_process.spawn('node', [ mainModule ]);

    worker.on('exit', function (code) {
    	console.log('worker process exited with code ' + code);
        if (code !== 0) {
            spawn(mainModule);
        }
    });	
}

//spawn('worker.js');
spawn('0051-child-process.js');

// 守护进程一般用于监控工作进程的运行状态，在工作进程不正常退出时重启工作进程，保障工作进程不间断运行。

