var Server = function(simulation, serviceRng) {
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
  customer.wasServiceStarted = true;
  customer.serviceStartedAt = this.simulation.clock;

  this.customer = customer;
};

Server.prototype.leave = function() {
  var customer = this.customer;
  customer.wasServiceFinished = true;
  customer.serviceFinishedAt = this.simulation.clock;

  this.customer = null;
  this.departureEvent.time = Number.MAX_VALUE;

  return customer;
};

Server.prototype.occupied = function() {
  return this.customer != null;
};

Server.prototype.generateNextDeparture = function() {
  this.departureEvent.time = simulation.clock + this.serviceRng.next();
};
