# node-wrk
Prepare command line argiments and parse the output of the [wrk](https://github.com/wg/wrk) load testing tool

# example

``` js
var wrk = require('wrk');

var conns = 1;
var results = [];

function benchmark() {
  if (n == 100)
    return console.log(JSON.stringify(results));
  conns++;
  wrk({
    threads: 10,
    connections: conns,
    duration: '10s',
    printLatency: true,
    url: 'http://localhost:3000/'
  }, function(err, out) {
     results.push(out);
     benchmark();
  });
}
benchmark();
```
Options:

  - `threads`
  - `connections`
  - `duration`
  - `printLatency`
  - `url`: target url
  - `path`: path to wrk binary (default is "wrk")

Callback parameters: (err, wrkResults) where wrkResults is a hash with
  - transferPerSec
  - requestsPerSec
  - requestsTotal
  - durationActual
  - transferTotal
  - latencyAvg
  - latencyStdev
  - latencyStdevPerc
  - latencyMax
  - latency50
  - latency75
  - latency90
  - latency99
  - rpsAvg
  - rpsMax
  - rpsStdev
  - rpsStdevPerc
  - connectErrors
  - readErrors
  - writeErrors
  - timeoutErrors

# install

With [npm](https://npmjs.org) do:

```
npm install wrk
```

# license

MIT
