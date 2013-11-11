var UniformRng = function() {

};

UniformRng.prototype.next = function() {
  return Math.random();
};

var LcgRng = function(a, m, seed) {
  this.a = a;
  this.m = m;
  this.last = seed;
};

LcgRng.prototype.next = function() {
  this.last = (this.a * this.last) % this.m;
  return this.last / this.m;
};

var ExpRng = function(avg, rng) {
  this.avg = avg;
  this.rng = rng;
};

ExpRng.prototype.next = function() {
  return this.fromUniform(this.rng.next());
};

ExpRng.prototype.fromUniform = function(u) {
  return -this.avg * Math.log(u);
};

var AntitheticRng = function(rng) {
  this.rng = rng;
  this.stream = [];
};

AntitheticRng.prototype.next = function() {
  var val = this.rng.next();
  this.stream.push(val);
  return val;
};

var AntitheticComplimentRng = function(rng, stream) {
  this.rng = rng;
  this.stream = stream;
  this.i = 0;
};

AntitheticComplimentRng.prototype.next = function() {
  var val;
  if (this.i < this.stream.length) {
    val = this.rng.fromUniform(1 - this.stream[this.i]);
    this.i++;
  } else {
    val = this.rng.fromUniform(1 - this.rng.rng.next());
  }
  return val;
};
