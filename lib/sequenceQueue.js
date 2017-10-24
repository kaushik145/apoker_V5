"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sequenceQueueFactory;
/**
 * Jobs can be pushed into the queue and are handled sequentially.
 * job N is only handled after job N-1 is done, even if both are pushed "simultaneously" (one right after the other).
 *
 * Currently the sequence queue only supports a single jobHandler (all we need for now).
 *
 */
function sequenceQueueFactory(jobHandler) {
  var queue = [];
  var handler = jobHandler;
  var isCurrentlyHandling = false;

  return {
    push: push
  };

  /**
   * Push a job into the queue
   * @param {Object} job
   */
  function push(job) {
    queue.push(job);

    if (!isCurrentlyHandling) {
      // if not yet handling, start handling
      invokeJobHandler();
    }
  }

  function invokeJobHandler() {
    if (!handler || queue.length < 1) {
      return;
    }

    isCurrentlyHandling = true;

    var job = queue.shift();
    handler(job, function () {
      isCurrentlyHandling = false;
      invokeJobHandler();
    });
  }
}