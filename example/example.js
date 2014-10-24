var wrk = require('../index.js');

wrk({
  threads: 2,
  connections: 5,
  duration: '2s',
  printLatency: true,
  url: 'http://localhost:5000/explody',
  debug: true
}, function(err, out) {
   console.log(out)
});
