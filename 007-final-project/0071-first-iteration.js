var fs = require('fs'),
    path = require('path'),
    http = require('http');

var MIME = {
    '.css': 'text/css',
    '.js': 'application/javascript'
};

// 合并文件的具体实现，合并文件时使用异步API读取文件，避免服务器因等待磁盘IO而发生阻塞。
// 输入['./foo/bar.js', './foo/baz.js']
function combineFiles(pathnames, callback) {
    var output = [];

    (function next(i, len) {
        if (i < len) {
            //依次读取文件，放入数组
            fs.readFile(pathnames[i], function (err, data) {
                if (err) {
                    callback(err);
                } else {
                    output.push(data);
                    next(i + 1, len);
                }
            });
        } else {
            //全部文件读完后，把数组内容读入Buffer, 通过回调函数传回
            callback(null, Buffer.concat(output));
        }
    }(0, pathnames.length));
}

//使用命令行参数传递JSON配置文件路径，入口函数负责读取配置并创建服务器。
//入口函数完整描述了程序的运行逻辑，其中解析URL和合并文件的具体实现封装在其它两个函数里
function main(argv) {
    //读取配置json文件
    var config = JSON.parse(fs.readFileSync(argv[0], 'utf-8')),
        root = config.root || '.',
        port = config.port || 80;

    //创建web服务器，并对配置文件中的端口进行监听    
    http.createServer(function (request, response) {

        //解析URL
        var urlInfo = parseURL(root, request.url);

        //合并文件
        combineFiles(urlInfo.pathnames, function (err, data) {
            if (err) {
                response.writeHead(404);
                response.end(err.message);
            } else {
                response.writeHead(200, {
                    'Content-Type': urlInfo.mime
                });
                response.end(data);
            }
        });
    }).listen(port);
}

// 解析URL时先将普通URL转换为文件合并URL，使得两种URL的处理方式可以一致。
// 输入：根目录和请求带的URL，如/foo/??bar.js,baz.js
// 输出：{'application/javascript', ['./foo/bar.js', './foo/baz.js'] }
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

// 以上代码完整实现了服务器所需的功能，并且有以下几点值得注意：
// 使用命令行参数传递JSON配置文件路径，入口函数负责读取配置并创建服务器。
// 入口函数完整描述了程序的运行逻辑，其中解析URL和合并文件的具体实现封装在其它两个函数里。
// 解析URL时先将普通URL转换为了文件合并URL，使得两种URL的处理方式可以一致。
// 合并文件时使用异步API读取文件，避免服务器因等待磁盘IO而发生阻塞。
// 
// 测试路径：
// http://localhost/??bar.js,baz.js
// http://localhost/foo/??bar.js,baz.js