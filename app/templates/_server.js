var derby = require('derby');

derby.run(function(){
  require('coffee-script/register');

  var http  = require('http');
  var chalk = require('chalk');

  var publicDir = process.cwd() + '/public';

  var apps = [
    require('./apps/<%= app %>')
  ];

  // Config
  var defaults = require('./config/defaults');

  for(var key in defaults) {
    process.env[key] = process.env[key] || defaults[key];
  }

  var express = require('./server/express');
  var error = require('./server/error');

  var store = require('./server/store')(derby);
  express(store, apps, error, function(expressApp, upgrade){
    var server = http.createServer(expressApp);

    server.on('upgrade', upgrade);
    
    var writed = 0;
    apps.forEach(function(app){
      app.writeScripts(store, publicDir, {extensions: ['.coffee']}, function(){
        console.log('Bundle created:', chalk.yellow(app.name));
        
        writed++;
        if (writed == apps.length) {
          server.listen(process.env.PORT, function() {
            console.log('%d listening. Go to: http://localhost:%d/', process.pid, process.env.PORT);
          });
        }
      });
    });
  });
});
