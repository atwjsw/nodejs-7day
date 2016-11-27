function sync(fn) {
    return fn();
}

try {
    sync(null);
    // Do something.
} catch (err) {
    console.log('Error: %s', err.message);
}

console.log("执行完成");

/*-- Console ------------------------------
Error: object is not a function*/

// 异常会沿着代码执行路径一直冒泡，直到遇到第一个try语句时被捕获住。