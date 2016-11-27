var argv = require('argv'),
    echo = require('../lib/echo');
//console.log(echo(argv.join(' ')));
//
args = argv.run();
console.log(args.targets.join(' '));