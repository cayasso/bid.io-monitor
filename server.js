var server = require('./');
var port = server.app.get('port');

// Startup monitor server
server.app.listen(port, function(){
  console.log("Monitor server listening on port " + port);
});
