var async = require('async');
var derby = require('derby');

var http  = require('http');
var chalk = require('chalk');

var publicDir = process.cwd() + '/public';

derby.run(function(){
  require('coffee-script/register');
  require('./server/config');

  var apps = [
    require('./apps/<%= app %>')
  ];

  var express = require('./server/express');
  var store = require('./server/store')(derby);

  var error = require('./server/error');

  express(store, apps, error, function(expressApp, upgrade){
    var server = http.createServer(expressApp);

    server.on('upgrade', upgrade);

    async.each(apps, function (app, cb) {
      app.writeScripts(store, publicDir, {extensions: ['.coffee']}, function(){
        console.log('Bundle created:', chalk.yellow(app.name));
        cb();
      });
    }, function(){
      server.listen(process.env.PORT, function() {
        console.log('%d listening. Go to: http://localhost:%d/', process.pid, process.env.PORT);
      });
    });

  });
});