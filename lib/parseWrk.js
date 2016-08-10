module.exports = parseWrk

function parseWrk(stdout) {
  var lines = stdout.split('\n');
  var result = {};
  result.transferPerSec = lines[lines.length - 2].split(':')[1].trim();
  result.requestsPerSec = Number(lines[lines.length - 3].split(':')[1].trim());

  var errorsLine = 0;
  for (var i = 0; i < lines.length; i++) {
    if (handleErrors(lines[i], result)) {
      errorsLine++;
    }
  }

  var m = lines[lines.length - 4 - errorsLine].match(/(\d+) requests in ([0-9\.]+[A-Za-z]+), ([0-9\.]+[A-Za]+)/);
  result.requestsTotal  = Number(m[1]);
  result.durationActual = m[2];
  result.transferTotal  = m[3];

  var latencyMinMax   = lines[3].split(/[\t ]+/);
  result.latencyAvg   = latencyMinMax[2];
  result.latencyStdev = latencyMinMax[3];
  result.latencyMax   = latencyMinMax[4];
  result.latencyStdevPerc  = Number(latencyMinMax[5].slice(0,-1));
  var rpsMinMax   = lines[4].split(/[\t ]+/);
  result.rpsAvg   = rpsMinMax[2];
  result.rpsStdev = rpsMinMax[3];
  result.rpsMax   = rpsMinMax[4];
  result.rpsStdevPerc  = Number(rpsMinMax[5].slice(0,-1));

  if (lines[5].match(/Latency Distribution/)) {
    result.latency50 = lines[6].split(/[\t ]+/)[2];
    result.latency75 = lines[7].split(/[\t ]+/)[2];
    result.latency90 = lines[8].split(/[\t ]+/)[2];
    result.latency99 = lines[9].split(/[\t ]+/)[2];
  }

  var histogram = [];
  for (var i=0; i < lines.length; ++i) {
    if (lines[i].match(/Detailed Percentile spectrum:/) && i < lines.length - 3) {
      for (var l=i+4; lines[l] != ''; ++l) {
        var nums = lines[l].trim().split(/[ \t]+/);
        if (nums.length != 4) break;
        console.log('Histo: ', nums);
        histogram.push({
          latency: Number(nums[0]),
          percentile: Number(nums[1]),
          total: Number(nums[2])
        });
      }
      break;
    }
  }
  if (histogram.length) {
    result.histogram = histogram;
  }
  return result;
}

function handleErrors(line, result) {
  var errorsRe = /Socket errors: connect (\d+), read (\d+), write (\d+), timeout (\d+)/;
  var errorsMatch = line.match(errorsRe);
  if (errorsMatch) {
    result.connectErrors = errorsMatch[1];
    result.readErrors    = errorsMatch[2];
    result.writeErrors   = errorsMatch[3];
    result.timeoutErrors = errorsMatch[4];
    return true
  }

  var non2xx3xx = /Non-2xx or 3xx responses: (\d+)/;
  var non2xx3xxMatch = line.match(non2xx3xx);
  if (non2xx3xxMatch) {
    result.non2xx3xx = Number(non2xx3xxMatch[1]);
    return true
  }
}
