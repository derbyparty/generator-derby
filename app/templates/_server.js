require('coffee-script/register');

var derby = require('derby');
var http  = require('http');
var defaults = require('./config/defaults');

for(var key in defaults) {
  process.env[key] = process.env[key] || defaults[key];
}

derby.run(createServer);

function createServer() {
  var expressApp = require('./server/index');

  http.createServer(expressApp).listen(process.env.PORT, listenCallback);
}

function listenCallback(err) {
  console.log('%d listening. Go to: http://localhost:%d/', process.pid, process.env.PORT);
}