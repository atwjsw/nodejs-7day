var fs = require('fs');
var rs = fs.createReadStream("C:\\Users\\Public\\Videos\\Sample Videos\\Wildlife.wmv");
var ws = fs.createWriteStream("C:\\Users\\Public\\Videos\\Sample Videos\\Wildlife.wmv.bak");

rs.on('data', function (chunk) {
    if (ws.write(chunk) === false) {
        rs.pause();
    }
});

rs.on('end', function () {
    ws.end();
});

ws.on('drain', function () {
    rs.resume();
});

// 以上代码实现了数据从只读数据流到只写数据流的搬运，并包括了防爆仓控制。
// 因为这种使用场景很多，例如上边的大文件拷贝程序，NodeJS直接提供了.pipe方法来做这件事情，其内部实现方式与上边的代码类似。