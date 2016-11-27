process.on('uncaughtException', function (err) {
    console.log('Error: %s', err.message);
});

setTimeout(function (fn) {
    fn();
});

console.log("执行完成");

// -- Console ------------------------------
// Error: undefined is not a function