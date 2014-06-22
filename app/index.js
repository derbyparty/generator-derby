'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var DerbyGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

//    console.log(this.appname);

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });

    // setup the test-framework property, Gruntfile template will need this
    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });
    this.testFramework = this.options['test-framework'];

    this.option('coffee', {
      desc: 'Use CoffeeScript',
      type: Boolean,
      defaults: false
    });
    this.coffee = this.options.coffee;
  },

  askFor: function () {
    var done = this.async();

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Jade',
        value: 'includeJade',
        checked: true
      },{
        name: 'Stylus',
        value: 'includeStylus',
        checked: true
      },{
        name: 'Redis',
        value: 'includeRedis',
        checked: false
      }]
    }];

    this.prompt(prompts, function (answers) {
      var features = answers.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.includeJade    = hasFeature('includeJade');
      this.includeStylus  = hasFeature('includeStylus');
      this.includeRedis   = hasFeature('includeRedis');

      done();
    }.bind(this));
  },

  app: function () {
    var js    = this.coffee ? 'coffee': 'js';
    var html  = this.includeJade ? 'jade': 'html';
    var css   = this.includeStylus?  'styl': 'css';

    this.mkdir('components');
    this.mkdir('config');
    this.copy('config/defaults.json', 'config/defaults.json');

    this.mkdir('public');
    this.mkdir('server');
    this.copy('server/error.'+js, 'server/error.'+js);
    this.template('server/_index.' + js, 'server/index.'+js);


    this.mkdir('src');

    this.mkdir('src/app');
    this.template('src/app/_index.' + js, 'src/app/index.'+js);

    this.mkdir('src/error');
    this.template('src/error/_index.' + js, 'src/error/index.'+js);

    this.mkdir('views');
    this.mkdir('views/app');
    this.copy('views/app/index.'+html, 'views/app/index.'+html);
    this.copy('views/app/home.'+html, 'views/app/home.'+html);

    this.mkdir('views/error');
    this.copy('views/error/index.'+html, 'views/error/index.'+html);
    this.copy('views/error/403.'+html, 'views/error/403.'+html);
    this.copy('views/error/404.'+html, 'views/error/404.'+html);
    this.copy('views/error/500.'+html, 'views/error/500.'+html);


    this.mkdir('styles');
    this.mkdir('styles/app');
    this.copy('styles/app/index.'+css, 'styles/app/index.'+css);
    this.mkdir('styles/error');
    this.copy('styles/error/index.'+css, 'styles/error/index.'+css);
    this.copy('styles/error/reset.'+css, 'styles/error/reset.'+css);

    this.template('_server.'+js, 'server.'+js);

    this.template('_package.json', 'package.json');
    this.template('_README.md', 'README.md');
  },

  projectfiles: function () {
//    this.copy('editorconfig', '.editorconfig');
//    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = DerbyGenerator;
