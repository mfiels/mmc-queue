listeners = {};

function on(event, handler) {
  if (!listeners[event]) {
    listeners[event] = [];
  }
  listeners[event].push(handler);
}

function emit(event, data) {
  if (listeners[event]) {
    for (var i = 0; i < listeners[event].length; i++) {
      listeners[event][i](data);
    }
  }
}