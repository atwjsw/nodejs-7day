function heavyCompute(n, callback) {
    var count = 0,
        i, j;

    for (i = n; i > 0; --i) {
        for (j = n; j > 0; --j) {
            count += 1;
        }
    }

    callback(count);
}

heavyCompute(100000, function (count) {
    console.log(count);
});

console.log('hello');

/*-- Console ------------------------------
100000000
hello*/


// 在代码中，异步编程的直接体现就是回调。异步编程依托于回调来实现，但不能说使用了回调后程序就异步化了。我们首先可以看看以下代码。
// 可以看到，以上代码中的回调函数仍然先于后续代码执行。JS本身是单线程运行的，
// 不可能在一段代码还未结束运行时去运行别的代码，因此也就不存在异步执行的概念。