/* parent.js */
var child = child_process.spawn('node', [ 'child.js' ]);

child.kill('SIGTERM');

/* child.js */
process.on('SIGTERM', function () {
    cleanUp();
    process.exit(0);
});

// 在上例中，父进程通过.kill方法向子进程发送SIGTERM信号，子进程监听process对象的SIGTERM事件响应信号。
// 不要被.kill方法的名称迷惑了，该方法本质上是用来给进程发送信号的，进程收到信号后具体要做啥，
// 完全取决于信号的种类和进程自身的代码。
// 另外，如果父子进程都是NodeJS进程，就可以通过IPC（进程间通讯）双向传递数据。