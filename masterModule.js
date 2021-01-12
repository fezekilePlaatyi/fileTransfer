module.exports = Master;

/*
 * Master class (runs as mesh component)
 *
 * @api public
 * @constructor
 *
 */

function Master() {
  console.log('new master');
}

// Add these functions after constructor

/*
 * Start method (called at mesh start(), if configured)
 *
 * @api public
 * @param {ComponentInstance} $happn - injected by the mesh when it calls this function
 * @param {Function} callback
 *
 */

Master.prototype.start = function($happn, callback) {
//Agent.proto...
  $happn.log.info('starting master component');
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

Master.prototype.stop = function($happn, callback) {
//Agent.proto...
  $happn.log.info('stopping master component');
  callback();
}

/*
 * Report metric method (called by remote agents across the exchange)
 *
 * @api public
 * @param {ComponentInstance} $happn - injected by the mesh when it calls this function
 * @param {String} hostname - of the agent
 * @param {Metric} metric
 * @param {Function} callback
 *
 */

Master.prototype.reportMetric = function($happn, hostname, metric, callback) {

  var eventKey = 'metrics/' + hostname + '/' + metric.key;
  var eventData = metric;

  $happn.log.debug("emitting '%s': '%j'", eventKey, eventData);

  $happn.emit(eventKey, eventData);

  callback();
}