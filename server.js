var Server = function(simulation, id, serviceRng) {
  this.id = id;
  this.simulation = simulation;
  this.serviceRng = serviceRng;
  this.departureEvent = new Event(
      Number.MAX_VALUE, 
      this, 
      simulation.handleDeparture
  );

  this.customer = null;
};

Server.prototype.occupy = function(customer) {
  this.generateNextDeparture();

  customer.wasServiceStarted = true;
  customer.serviceStartedAt = this.simulation.clock;
  customer.serviceFinishedAt = this.departureEvent.time;

  if (customer.wasQueued) {
    customer.queuedFor = customer.serviceStartedAt - customer.queuedAt;
  }

  this.customer = customer;

  this.simulation.emitter.emit('customerEnteredServer', {
    'serverId': this.id,
    'time': this.simulation.clock,
    'queueSize': this.simulation.queue.size(),
    'customer': customer
  });
};

Server.prototype.leave = function() {
  var customer = this.customer;
  customer.wasServiceFinished = true;
  customer.serviceFinishedAt = this.simulation.clock;
  customer.servicedFor = customer.serviceFinishedAt - customer.serviceStartedAt;

  this.customer = null;
  this.departureEvent.time = Number.MAX_VALUE;

  this.simulation.emitter.emit('customerLeftServer', {
    'serverId': this.id,
    'time': this.simulation.clock,
    'customer': customer
  });

  return customer;
};

Server.prototype.occupied = function() {
  return this.customer != null;
};

Server.prototype.generateNextDeparture = function() {
  this.departureEvent.time = simulation.clock + this.serviceRng.next();
};
