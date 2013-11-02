var Queue = function(simulation, interarrivalRng) {
  this.simulation = simulation;
  this.interarrivalRng = interarrivalRng;
  this.queue = [];
  this.arrivalEvent = new Event(
      Number.MAX_VALUE,
      this,
      simulation.handleArrival
  );
};

Queue.prototype.size = function() {
  return this.queue.length;
};

Queue.prototype.add = function(customer) {
  customer.wasQueued = true;
  customer.queuedAt = this.simulation.clock;
  this.queue.push(customer);

  emit('queueSizeChanged', {
    'size': this.size(),
    'time': simulation.clock
  });
};

Queue.prototype.remove = function() {
  var customer = this.queue.splice(0, 1);

  emit('queueSizeChanged', {
    'size': this.size(),
    'time': simulation.clock
  });

  return customer;
};

Queue.prototype.generateNextArrival = function() {
  this.arrivalEvent.time = simulation.clock + this.interarrivalRng.next();
};
