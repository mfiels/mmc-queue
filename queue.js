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
};

Queue.prototype.remove = function() {
  return this.queue.splice(0, 1);
};

Queue.prototype.generateNextArrival = function() {
  this.arrivalEvent.time = simulation.clock + this.interarrivalRng.next();
};
