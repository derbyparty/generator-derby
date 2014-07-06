'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var crypto = require('crypto');


var DerbyGenerator = yeoman.generators.Base.extend({
  init: function () {
    var self = this;
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies({
          'callback': function(){
            self.log('\nAll is done, to start app use: ' + chalk.yellow('npm start\n'));
          }
        });
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

    this.email    = this.user.git.email;
    this.username = this.user.git.username;

    this.secret = crypto.randomBytes(20).toString('hex');
    this.cookie = crypto.randomBytes(20).toString('hex');
  },

  askFor: function () {
    var done = this.async();

    this.log('Derby 0.6 App generator:\n');

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'Select features',
      choices: [{
        name: 'Jade',
        value: 'jade',
        checked: true
      },{
        name: 'Stylus',
        value: 'stylus',
        checked: true
      },{
        name: 'Redis',
        value: 'redis',
        checked: false
      },{
        name: 'Bootstrap 3',
        value: 'bootstrap',
        checked: false
//      },{
//        name: 'Derby-login',
//        value: 'login',
//        checked: false
//      },{
//        name: 'Racer-schema',
//        value: 'schema',
//        checked: false
      }]
    }];

    this.prompt(prompts, function (answers) {
      var features = answers.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.jade    = hasFeature('jade');
      this.stylus  = hasFeature('stylus');
      this.redis   = hasFeature('redis');
//      this.login   = hasFeature('login');
//      this.schema     = hasFeature('schema');
      this.bootstrap  = hasFeature('bootstrap');
      this.login   = false;
      this.schema  = false;

      this.config.defaults({
        app: this.appname,
        coffee: this.coffee,
        stylus: this.stylus,
        jade: this.jade
      });

      this.config.save();

      done();
    }.bind(this));
  },

  app: function () {
    var js    = this.coffee ? 'coffee': 'js';
    var html  = this.jade ? 'jade': 'html';
    var css   = this.stylus?  'styl': 'css';

    this.mkdir('components');

    this.mkdir('config');
    this.template('config/_defaults.json', 'config/defaults.json');

    this.mkdir('test');

    this.mkdir('public');
    this.mkdir('server');
    this.copy('server/error.'+js, 'server/error.'+js);
    this.copy('server/routes.'+js, 'server/routes.'+js);
    this.template('server/_express.' + js, 'server/express.'+js);
    this.template('server/_store.' + js, 'server/store.'+js);

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
