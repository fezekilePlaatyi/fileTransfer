// up top
var os = require('os');
module.exports = Agent;

/*
 * Agent class (runs as mesh component)
 *
 * @api public
 * @constructor
 *
 */

function Agent() {
  console.log('new agent');
}

/*
 * Start method (called at mesh start(), if configured)
 *
 * @api public
 * @param {ComponentInstance} $happn - injected by the mesh when it calls this function
 * @param {Function} callback
 *
 */

Agent.prototype.start = function($happn, callback) {
  $happn.log.info('starting agent component');

  var hostname = os.hostname();
  var inspectors = $happn.config.inspectors;

  Object.keys(inspectors).forEach(function(key) {

    var interval = inspectors[key].interval || 10000;
    var inspect = inspectors[key].fn;

    // run multiple inspectors each in separate interval

    inspectors[key].runner = setInterval(function() {

      // TODO: properly deal with inspector taking longer than interval
      
      inspect(function(error, result) {

        if (error) return $happn.log.error("inspector at key: '%s' failed", key, error);

        // submit inspect result to master

        var metric = {
          ts: Date.now(),
          key: key,
          val: result
        }

        console.log("Sending packets. Time: ", Date.now())

        $happn.exchange.MasterNode.master.reportMetric(hostname, metric, function(error, result) {
          // callback as called by master.reportMetric
          if (error) return $happn.log.error('from reportMetric', error);
          // $happn.log.info('result from reportMetric: %j', result);
        });

      });

    }, interval);

  });

  callback();
}


/*
 * Stop method (called at mesh stop(), if configured)
 *
 * @api public
 * @param {ComponentInstance} $happn - injected by the mesh when it calls this function
 * @param {Function} callback
 *
 */

Agent.prototype.stop = function($happn, callback) {
  $happn.log.info('stopping agent component');

  // stop all inspector intervals
  var inspectors = $happn.config.inspectors;
  Object.keys(inspectors).forEach(function(key) {
    clearInterval(inspectors[key].runner);
  });
  
  callback();
}