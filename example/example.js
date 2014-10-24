var wrk = require('../index.js');

wrk({
  threads: 2,
  connections: 5,
  duration: '10s',
  printLatency: true,
  url: 'http://localhost:3000/test'
}, function(err, out) {
  if (err) {
    console.error('err: ', err)
  }
  console.log('out: ', out)
});
