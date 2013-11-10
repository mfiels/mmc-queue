var CSV = {
  delays: [],
  run: [],

  listen: function(simulation) {
    simulation.emitter.on('customerEnteredServer', function(e) {
      CSV.run.push(e.customer.queuedFor);
    });
  },

  runComplete: function() {
    CSV.delays.push(CSV.run);
    CSV.run = [];
  },

  write: function() {
    var csv = '';
    for (var i = 0; i < CSV.delays.length; i++) {
      csv += 'Run ' + (i + 1) + ',';
    }
    for (var i = 0; ; i++) {
      csv += '\n';
      var valueFound = false;
      for (var j = 0; j < CSV.delays.length; j++) {
        if (i < CSV.delays[j].length) {
          valueFound = true;
          csv += CSV.delays[j][i];
        }
        csv += ',';
      }
      if (!valueFound) {
        break;
      }
    }
    document.write('<pre>' + csv + '</pre>');
  }
};
