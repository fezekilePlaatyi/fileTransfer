module.exports = Master;
const NATS = require('nats')
const nc = NATS.connect()
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
  $happn.log.info('stopping master component');
  // Close connection
  nc.close()
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
  console.log("Packet received")
  console.log("Event Key: ", eventKey)
  console.log("Data")
  console.log(eventData)
  $happn.emit(eventKey, eventData);

  callback();
}

// Simple Publisher
nc.publish('foo', 'Hello World!')

// Simple Subscriber
nc.subscribe('foo', function (msg) {
  console.log('Received a message: ' + msg)
})
