function async(request, callback) {
    // Do something.
    asyncA(request, function (err, data) {
        if (err) {
            callback(err);
        } else {
            // Do something
            asyncB(request, function (err, data) {
                if (err) {
                    callback(err);
                } else {
                    // Do something
                    asyncC(request, function (err, data) {
                        if (err) {
                            callback(err);
                        } else {
                            // Do something
                            callback(null, data);
                        }
                    });
                }
            });
        }
    });
}

http.createServer(function (request, response) {
    async(request, function (err, data) {
        if (err) {
            response.writeHead(500);
            response.end();
        } else {
            response.writeHead(200);
            response.end(data);
        }
    });
});

// 以上代码将请求对象交给异步函数处理后，再根据处理结果返回响应。这里采用了使用回调函数传递异常的方案，
// 因此async函数内部如果再多几个异步函数调用的话，代码就变成上边这副鬼样子了。
// 为了让代码好看点，我们可以在每处理一个请求时，使用domain模块创建一个子域（JS子运行环境）。
// 在子域内运行的代码可以随意抛出异常，而这些异常可以通过子域对象的error事件统一捕获。