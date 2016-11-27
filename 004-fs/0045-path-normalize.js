 var path = require('path');
 var cache = {};

 function store(key, value) {
     cache[path.normalize(key)] = value;
 }

 store('foo/bar', 1);
 store('foo//baz//../bar', 2);
 console.log(cache); // => { "foo/bar": 2 }

 console.log(path.join('foo/', 'baz/', '../bar')); // => "foo/bar"

 console.log(path.extname('foo/bar.js')); // => ".js"

 // 将传入的路径转换为标准路径，具体讲的话，除了解析路径中的.与..外，还能去掉多余的斜杠。
 // 如果有程序需要使用路径作为某些数据的索引，但又允许用户随意输入路径时，就需要使用该方法保证路径的唯一性。
 // 
 // 坑出没注意： 标准化之后的路径里的斜杠在Windows系统下是\，而在Linux系统下是/。
 // 如果想保证任何系统下都使用/作为路径分隔符的话，需要用.replace(/\\/g, '/')再替换一下标准路径。
