var fs = require('fs'),
    path = require('path'),
    http = require('http');

var MIME = {
    '.css': 'text/css',
    '.js': 'application/javascript'
};

function main(argv) {
    var config = JSON.parse(fs.readFileSync(argv[0], 'utf-8')),
        root = config.root || '.',
        port = config.port || 80,
        server;

    server = http.createServer(function (request, response) {
        //解析URL，同第一版
        var urlInfo = parseURL(root, request.url);

        //增加文件验证，文件都有效，马上输出响应头，再依次输出文件outputFiles(pathnames, response)
        validateFiles(urlInfo.pathnames, function (err, pathnames) {
            if (err) {
                response.writeHead(404);
                response.end(err.message);
            } else {
                response.writeHead(200, {
                    'Content-Type': urlInfo.mime
                });
                outputFiles(pathnames, response);
            }
        });
         console.log("request processed...");
    }).listen(port);

    console.log("server started...");
    process.on('SIGTERM', function () {
        server.close(function () {
            process.exit(0);
        });
    });
}

//输出文件， 传入文件名数组和响应对象
function outputFiles(pathnames, writer) {
    (function next(i, len) {
        if (i < len) {
            var reader = fs.createReadStream(pathnames[i]);
            //读取文件，同时输出到Response
            reader.pipe(writer, { end: false });
            //读完一个到下一个。
            reader.on('end', function() {
                next(i + 1, len);
            });
        } else {
            //全部读完，关闭Response.
            writer.end();
        }
    }(0, pathnames.length));
}


function validateFiles(pathnames, callback) {
    (function next(i, len) {
        //依次验证每一文件
        if (i < len) {            
            fs.stat(pathnames[i], function (err, stats) {
                if (err) {
                    callback(err);
                //如果文件不存在，通过回调函数返回错误
                } else if (!stats.isFile()) {
                    callback(new Error());
                } else {
                    next(i + 1, len);
                }
            });
        } else {
            callback(null, pathnames);
        }
    }(0, pathnames.length));
}

//解析URL，同第一版
function parseURL(root, url) {
    var base, pathnames, parts;

    //如果没有??，即为普通url，把第一个/换成/??。（解析URL时先将普通URL转换为文件合并URL）
    // /foo/bar.js =》/??foo/bar.js
    if (url.indexOf('??') === -1) {
        url = url.replace('/', '/??');
    }

    parts = url.split('??'); 
    base = parts[0]; // /foo/
    pathnames = parts[1].split(',').map(function (value) { // parts[1] = bar.js,baz.js
        return path.join(root, base, value); // pathnames = ['./foo/bar.js', './foo/baz.js']
    });

    return {
        mime: MIME[path.extname(pathnames[0])] || 'text/plain', //MIME['.js'] = 'application/javascript'
        pathnames: pathnames
    };
}

main(process.argv.slice(2));

