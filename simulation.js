var Simulation = function(interarrivalRng, serviceRng, numServers) {
  this.interarrivalRng = interarrivalRng;
  this.serviceRng = serviceRng;
  this.numServers = numServers;
  this.emitter = new Emitter();
};

Simulation.prototype.init = function() {
  this.queue = new Queue(this, this.interarrivalRng);
  this.servers = [];
  this.events = [];
  this.clock = 0.0;
  this.inSystem = 0;
  this.serviced = 0;

  this.events.push(this.queue.arrivalEvent);

  for (var i = 0; i < this.numServers; i++) {
    var server = new Server(this, i, this.serviceRng);
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
  var server = this.firstOpenServer();
  var customer = new Customer(this.clock);
  this.inSystem++;

  if (server) {
    server.occupy(customer);
  } else {
    this.queue.add(customer);
  }

  this.emitter.emit('customerArrived', {
    'time': simulation.clock,
    'inSystem': this.inSystem,
    'queueSize': this.queue.size(),
    'customer': customer
  });

  this.queue.generateNextArrival();
};

Simulation.prototype.handleDeparture = function(e) {
  var server = e.data;
  var customer = server.leave();
  this.inSystem--;
  this.serviced++;

  if (this.queue.size() > 0) {
    server.occupy(this.queue.remove());
  }

  this.emitter.emit('customerDeparted', {
    'time': simulation.clock,
    'inSystem': this.inSystem,
    'serviced': this.serviced,
    'customer': customer
  });
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
