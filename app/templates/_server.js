var async = require('async');
var derby = require('derby');

var http  = require('http');
var chalk = require('chalk');

var publicDir = process.cwd() + '/public';

derby.run(function(){
  require('coffee-script/register');<% if (yamlify) { %>
  require('yamlify/register');<% } %>

  require('./server/config');

  var apps = [
    require('./apps/<%= app %>')
    // <end of app list> - don't remove this comment
  ];

  var express = require('./server/express');
  var store = require('./server/store')(derby, publicDir);

  var error = require('./server/error');

  express(store, apps, error, publicDir, function(expressApp, upgrade){
    var server = http.createServer(expressApp);

    server.on('upgrade', upgrade);

    async.each(apps, bundleApp, function(){
      server.listen(process.env.PORT, function() {
        console.log('%d listening. Go to: http://localhost:%d/',
            process.pid, process.env.PORT);
      });
    });

    function bundleApp (app, cb) {
      app.writeScripts(store, publicDir, {extensions: ['.coffee']}, function(err){
        if (err) {
          console.log("Bundle don't created:", chalk.red(app.name), ', error:', err);
        } else {
          console.log('Bundle created:', chalk.blue(app.name));
        }
        cb();
      });
    }

  });
});