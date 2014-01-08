var wrk = require('../index.js');

wrk({
  threads: 10,
  connections: n+1,
  duration: '10s',
  printLatency: true,
  url: 'http://localhost:3000/test'
}, function(err, out) {
   console.log(out)
});
