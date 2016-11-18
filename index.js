var exec = require('child_process').exec;
var parseWrk = require('./lib/parseWrk');
var util = require("util");

function wrk(opts, callback) {
  var cmd = opts.path || 'wrk';

  if (opts.threads)
    cmd += ' -t' + opts.threads;
  if (opts.connections)
    cmd += ' -c' + opts.connections;
  if (opts.duration)
    cmd += ' -d' + opts.duration;
  if (opts.script)
    cmd += ' -s' + opts.script;
  if (opts.timeout)
    cmd += ' --timeout ' + opts.timeout;
  if (opts.rate)
    cmd += ' -R' + opts.rate;
  if (opts.printLatency)
    cmd += ' --latency ';
  if (opts.headers) {
    Object.keys(opts.headers).forEach(function(key) {
      cmd += util.format(' -H  \'%s: %s\'', key,  opts.headers[key]);
    })
  }

  cmd += ' ' + opts.url;
  opts.debug && console.log(cmd);
  var child = exec(cmd, function(error, stdout, stderr) {
    if (opts.debug) {
      stdout && console.log(stdout);
      stderr && console.error(stderr);
    }
    if (error) {
      return callback(error);
    }

    callback(null, parseWrk(stdout));
  });
}

module.exports = wrk;
module.exports.co = function(opts) {
  return function(callback) {
    wrk(opts, callback);
  }
};
