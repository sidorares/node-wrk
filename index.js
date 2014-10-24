var exec = require('child_process').exec;
var parseWrk = require('./lib/parseWrk')

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
   if (opts.printLatency)
     cmd += ' --latency ';
   cmd += ' ' + opts.url;

   var child = exec(cmd, function(error, stdout, stderr) {
      if (error)
        return callback(error);

      if (opts.debug) {
        console.log('stdout:\n', stdout.split('\n'))
        console.log('stderr:\n', stderr)
      }

      callback(null, parseWrk(stdout));
   });
   child.on('close', function(code, signal) {
     if (code === null)
       return callback(new Error('killed by signal: ' + signal));
     // TODO: handle non-zero exit code here
   });
}

module.exports = wrk;
module.exports.co = function(opts) {
  return function(callback) {
     wrk(opts, callback);
  }
}
