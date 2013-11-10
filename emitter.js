var Emitter = function() {
  this.listeners = {};
};

Emitter.prototype.on = function(event, handler) {
  if (!this.listeners[event]) {
    this.listeners[event] = [];
  }
  this.listeners[event].push(handler);
};

Emitter.prototype.emit = function(event, data) {
  if (this.listeners[event]) {
    for (var i = 0; i < this.listeners[event].length; i++) {
      this.listeners[event][i](data);
    }
  }
};
