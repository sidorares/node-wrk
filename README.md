# node-wrk
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/sidorares/node-wrk?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Prepare command line arguments and parse the output of the
[wrk](https://github.com/wg/wrk) load testing tool

# example

``` js
var wrk = require('wrk');

var conns = 1;
var results = [];

function benchmark() {
  if (conns === 100) {
    return console.log(results);
  }
  conns++;
  wrk({
    threads: 1,
    connections: conns,
    duration: '10s',
    printLatency: true,
    headers: { cookie: 'JSESSIONID=abcd' },
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
  - `headers`: object with additional request headers
  - `url`: target url
  - `path`: path to wrk binary (default is "wrk")
  - `debug`: print the output of `wrk` to stdout

Callback parameters: (err, wrkResults)

wrkResults always has:
  - transferPerSec
  - requestsPerSec
  - requestsTotal
  - durationActual
  - transferTotal
  - latencyAvg
  - latencyStdev
  - latencyStdevPerc
  - latencyMax
  - rpsAvg
  - rpsMax
  - rpsStdev
  - rpsStdevPerc

Has these if `printLatency` is enabled
  - latency50
  - latency75
  - latency90
  - latency99

And sometimes has (only if they exist):
  - connectErrors
  - readErrors
  - writeErrors
  - timeoutErrors
  - non2xx3xx

# install

With [npm](https://npmjs.org) do:

```
npm install wrk
```

# see also
[HTTPerf.js](https://github.com/jmervine/httperfjs)

# license

MIT
