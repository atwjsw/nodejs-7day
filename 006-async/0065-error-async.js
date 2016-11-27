function async(fn, callback) {
    // Code execution path breaks here.
    setTimeout(function ()　{
        callback(fn());
    }, 0);
}

try {
    async(null, function (data) {
        // Do something.
    });
} catch (err) {
    console.log('Error: %s', err.message);
}

console.log("执行完成");

/*-- Console ------------------------------
/home/user/test.js:4
        callback(fn());
                 ^
TypeError: object is not a function
    at null._onTimeout (/home/user/test.js:4:13)
    at Timer.listOnTimeout [as ontimeout] (timers.js:110:15)*/