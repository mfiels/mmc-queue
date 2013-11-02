var Simulation = function(interarrivalRng, serviceRng, numServers) {
  this.interarrivalRng = interarrivalRng;
  this.serviceRng = serviceRng;
  this.numServers = numServers;
};

Simulation.prototype.init = function() {
  this.queue = new Queue(this, this.interarrivalRng);
  this.servers = [];
  this.events = [];
  this.clock = 0.0;

  this.events.push(this.queue.arrivalEvent);

  for (var i = 0; i < this.numServers; i++) {
    var server = new Server(this, this.serviceRng);
    this.servers.push(server);
    this.events.push(server.departureEvent);
  }

  this.queue.generateNextArrival();
};

Simulation.prototype.simulate = function(stoppingCondition) {
  this.init();

  while (!stoppingCondition(this)) {
    var e = this.nextEvent();
    this.clock = e.time;

    e.handleEvent.call(this, e);
  }
};

Simulation.prototype.handleArrival = function(e) {
  console.log('arrival at ' + this.clock);
  var server = this.firstOpenServer();
  var customer = new Customer(this.clock);
  if (server) {
    console.log('sending to server');
    server.occupy(customer);
    server.generateNextDeparture();
  } else {
    console.log('queueing');
    this.queue.add(customer);
  }
  this.queue.generateNextArrival();
};

Simulation.prototype.handleDeparture = function(e) {
  var server = e.data;
  server.leave();
  console.log('departure at ' + this.clock);
  if (this.queue.size() > 0) {
    server.occupy(this.queue.remove());
    server.generateNextDeparture();
  }
};

Simulation.prototype.firstOpenServer = function() {
  for (var i = 0; i < this.servers.length; i++) {
    if (!this.servers[i].occupied()) {
      return this.servers[i];
    }
  }
  return null;
};

Simulation.prototype.nextEvent = function() {
  var earliestEvent = null;
  var earliestTime = Number.MAX_VALUE;
  for (var i = 0; i < this.events.length; i++) {
    if (this.events[i].time < earliestTime) {
      earliestEvent = this.events[i];
      earliestTime = this.events[i].time;
    }
  }
  return earliestEvent;
};
