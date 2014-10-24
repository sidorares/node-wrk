var test = require('tap').test;
var parseWrk = require('../lib/parseWrk');

test('parseWrk can handle a variety of inputs', function (t) {
  t.plan(3);
  t.test('handling the basic case', function (t) {
    t.plan(1)
    var wrkOutput = [
      'Running 2s test @ http://localhost:5000',
      '  2 threads and 5 connections',
      '  Thread Stats   Avg      Stdev     Max   +/- Stdev',
      '    Latency     2.51ms    1.81ms  16.54ms   94.95%',
      '    Req/Sec     0.95k   332.89     1.55k    56.57%',
      '  3745 requests in 2.00s, 683.90KB read',
      'Requests/sec:   1871.56',
      'Transfer/sec:    341.78KB',
      ''
    ].join('\n');

    var expectedResult ={
      transferPerSec: '341.78KB',
      requestsPerSec: 1871.56,
      requestsTotal: 3745,
      durationActual: '2.00s',
      transferTotal: '683.90KB',
      latencyAvg: '2.51ms',
      latencyStdev: '1.81ms',
      latencyMax: '16.54ms',
      latencyStdevPerc: 94.95,
      rpsAvg: '0.95k',
      rpsStdev: 332.89,
      rpsMax: '1.55k',
      rpsStdevPerc: 56.57
    };

    var result = parseWrk(wrkOutput);

    t.deepEqual(result, expectedResult)
  })

  t.test('handling the latency case', function (t) {
    t.plan(1)
    var wrkOutput = [
      'Running 2s test @ http://localhost:5000',
      '  2 threads and 5 connections',
      '  Thread Stats   Avg      Stdev     Max   +/- Stdev',
      '    Latency     2.51ms    1.81ms  16.54ms   94.95%',
      '    Req/Sec     0.95k   332.89     1.55k    56.57%',
      '  Latency Distribution',
      '     50%    2.25ms',
      '     75%    2.80ms',
      '     90%    3.09ms',
      '     99%   11.22ms',
      '  3745 requests in 2.00s, 683.90KB read',
      'Requests/sec:   1871.56',
      'Transfer/sec:    341.78KB',
      ''
    ].join('\n');

    var expectedResult ={
      transferPerSec: '341.78KB',
      requestsPerSec: 1871.56,
      requestsTotal: 3745,
      durationActual: '2.00s',
      transferTotal: '683.90KB',
      latencyAvg: '2.51ms',
      latencyStdev: '1.81ms',
      latencyMax: '16.54ms',
      latencyStdevPerc: 94.95,
      rpsAvg: '0.95k',
      rpsStdev: 332.89,
      rpsMax: '1.55k',
      rpsStdevPerc: 56.57,
      latency50: '2.25ms',
      latency75: '2.80ms',
      latency90: '3.09ms',
      latency99: '11.22ms'
    };

    var result = parseWrk(wrkOutput);

    t.deepEqual(result, expectedResult)
  })

  t.test('handling non2xx3xx', function (t) {
    t.plan(1)
    var wrkOutput = [
      'Running 2s test @ http://localhost:5000/explody',
      '  2 threads and 5 connections',
      '  Thread Stats   Avg      Stdev     Max   +/- Stdev',
      '    Latency     3.35ms    1.92ms  15.53ms   93.27%',
      '    Req/Sec   690.00    183.78     1.00k    57.91%',
      '  Latency Distribution',
      '     50%    2.58ms',
      '     75%    3.52ms',
      '     90%    4.04ms',
      '     99%   14.39ms',
      '  2632 requests in 2.00s, 3.76MB read',
      '  Non-2xx or 3xx responses: 2632',
      'Requests/sec:   1314.92',
      'Transfer/sec:      1.88MB',
      ''
    ].join('\n');

    var expectedResult = {
      transferPerSec: '1.88MB',
      requestsPerSec: 1314.92,
      non2xx3xx: 2632,
      requestsTotal: 2632,
      durationActual: '2.00s',
      transferTotal: '3.76MB',
      latencyAvg: '3.35ms',
      latencyStdev: '1.92ms',
      latencyMax: '15.53ms',
      latencyStdevPerc: 93.27,
      rpsAvg: '690.00',
      rpsStdev: '183.78',
      rpsMax: '1.00k',
      rpsStdevPerc: 57.91,
      latency50: '2.58ms',
      latency75: '3.52ms',
      latency90: '4.04ms',
      latency99: '14.39ms'
    };

    var result = parseWrk(wrkOutput);

    t.deepEqual(result, expectedResult);
  })
})