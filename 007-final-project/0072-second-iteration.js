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
        port = config.port || 80;

    http.createServer(function (request, response) {

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
    }).listen(port);
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

// 可以看到，第一版代码依次把请求的文件读取到内存中之后，再合并数据和输出响应。这会导致以下两个问题：

// 1. 当请求的文件比较多比较大时，串行读取文件会比较耗时，从而拉长了服务端响应等待时间。

// 2. 由于每次响应输出的数据都需要先完整地缓存在内存里，当服务器请求并发数较大时，会有较大的内存开销。

// 对于第一个问题，很容易想到把读取文件的方式从串行改为并行。但是别这样做，因为对于机械磁盘而言，因为只有一个磁头，
// 尝试并行读取文件只会造成磁头频繁抖动，反而降低IO效率。而对于固态硬盘，虽然的确存在多个并行IO通道，
// 但是对于服务器并行处理的多个请求而言，硬盘已经在做并行IO了，对单个请求采用并行IO无异于拆东墙补西墙。
// 因此，正确的做法不是改用并行IO，而是一边读取文件一边输出响应，把响应输出时机提前至读取第一个文件的时刻。
// 这样调整后，整个请求处理过程变成下边这样。
// 
// 可以看到，第二版代码在检查了请求的所有文件是否有效之后，立即就输出了响应头，并接着一边按顺序读取文件一边输出响应内容。
// 并且，在读取文件时，第二版代码直接使用了只读数据流来简化代码。