var Customer = function(arrivedAt) {
  this.arrivedAt = arrivedAt;

  this.wasQueued = false;
  this.queuedAt = 0.0;
  this.queuedFor = 0.0;

  this.wasServiceStarted = false;
  this.serviceStartedAt = 0.0;

  this.wasServiceFinished = false
  this.serviceFinishedAt = 0.0;
  this.servicedFor = 0.0;
};
