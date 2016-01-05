'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var crypto = require('crypto');
var updateNotifier = require('update-notifier');
var generatorUtil = require('../util.js');

var DerbyGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.log('\nDerby 0.6 Project generator:\n');

    this.pkg = require('../package.json');

    this.config.loadConfig();
    this.cfg = this.config.getAll();

    // App-mode
    if (this.cfg.project) {
      this.log(
          chalk.cyan('I\'ve found Derby project named: ') +
          chalk.yellow(this.cfg.project) + '\n'
      );

//      this.log(chalk.cyan('We are in app-creation mode!\n'));

      this.argument('name');

      if (this.cfg.apps.indexOf(this.name) >= 0) {
        this.log(
            chalk.red('Application already exists: ') +
            chalk.yellow(this.name) + '\n'
        );

        throw new Error('Application already exists');
      }

      this.appMode = true;
      this.login = false;

      this.coffee = this.cfg.coffee;

    // Project-mode
    } else {
      this.option('coffee', {
        desc: 'Use CoffeeScript',
        type: Boolean,
        defaults: false
      });

      this.coffee = this.options.coffee;
    }

    updateNotifier({packageName: this.pkg.name, packageVersion: this.pkg.version}).notify();

//    // setup the test-framework property, Gruntfile template will need this
//    this.option('test-framework', {
//      desc: 'Test framework to be invoked',
//      type: String,
//      defaults: 'mocha'
//    });
//
//    this.testFramework = this.options['test-framework'];



    this.email    = this.user.git.email;
    this.username = this.user.git.username;

    this.secret = crypto.randomBytes(20).toString('hex');
    this.cookie = crypto.randomBytes(20).toString('hex');
  },

  askForProject: function () {

    if (this.appMode) {
      return;
    }

    var done = this.async();

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'Select Project level features',
      choices: [{
        name: 'Redis', //proj level
        value: 'redis',
        message: 'Would you like to include Redis?',
        checked: false
      },{
        name: 'Derby-login', //proj level / app level
        value: 'login',
        message: 'Would you like to include Derby-login?',
        checked: false
      },{
        name: 'Racer-schema', //proj level
        value: 'schema',
        message: 'Would you like to include Racer-schema?',
        checked: false
      },{
        name: 'Yamlify', //proj level
        value: 'yamlify',
        message: 'Would you like to include Yamlify?',
        checked: false
      },{
        name: 'Bower', //proj level
        value: 'bower',
        message: 'Would you like to create initial Bower files and dirs?',
        checked: false
      },{
        name: 'Windows support', //proj level
        value: 'win',
        message: 'Would you like to add win support?',
        checked: false
      }]
    }, {
      when: function (answers) {
        return answers.features.indexOf('login') !== -1;
      },
      type: 'checkbox',
      name: 'loginPackages',
      message: 'Select derby-login packages',
      choices: [{
        name: 'GitHub',
        value: 'loginGithub',
        checked: false
      },{
        name: 'Google',
        value: 'loginGoogle',
        checked: false
      },{
        name: 'LinkedIn',
        value: 'loginLinkedIn',
        checked: false
      },{
        name: 'Facebook',
        value: 'loginFacebook',
        checked: false
      },
        {
          name: 'Vkontakte',
          value: 'loginVkontakte',
          checked: false
      }]
    }];

    this.prompt(prompts, function (answers) {
      var features = answers.features;
      var login = answers.loginPackages;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      function hasLoginPackage(feat) {
        return login && login.indexOf(feat) !== -1;
      }

      this.redis   = hasFeature('redis');
      this.login   = hasFeature('login');
      this.schema  = hasFeature('schema');
      this.yamlify  = hasFeature('yamlify');
      this.bower = hasFeature('bower');
      this.win = hasFeature('win');

      this.loginGithub = hasLoginPackage('loginGithub');
      this.loginGoogle = hasLoginPackage('loginGoogle');
      this.loginLinkedIn = hasLoginPackage('loginLinkedIn');
      this.loginFacebook = hasLoginPackage('loginFacebook');
      this.loginVkontakte = hasLoginPackage('loginVkontakte');

      done();
    }.bind(this));
  },
  askForAppName: function(){

    if (this.appMode) {
      this.app = this.name;
      return;
    }

    var done = this.async();

    var prompts = [{
      type: 'input',
      message: 'Input Derby-app name',
      default: 'app',
      name: 'app'
    }];

    this.prompt(prompts, function (answers) {
      this.app = answers.app;
      done();
    }.bind(this));

  },


  askForAppFeatures: function(){

    var done = this.async();

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'Select "' + chalk.yellow(this.app)+'"-application features',
      choices: [{
        name: 'Jade', //app level
        value: 'jade',
        checked: true
      },{
        name: 'Stylus', //app level
        value: 'stylus',
        checked: true
      },{
        name: 'derby-router', //app level
        value: 'router',
        checked: true
      },{
        name: 'Markdown', //app level
        value: 'md',
        checked: false
      },{
        name: 'Bootstrap 3', //app level
        value: 'bootstrap',
        checked: false
      }]
    }];

    this.prompt(prompts, function (answers) {

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      var features = answers.features;

      this.jade       = hasFeature('jade');
      this.stylus     = hasFeature('stylus');
      this.md         = hasFeature('md');
      this.bootstrap  = hasFeature('bootstrap');
      this.router     = hasFeature('router');

      done();

    }.bind(this));

  },

  saveConfig: function(){

    if (this.appMode) {
      this.cfg.apps = this.cfg.apps || [];
      this.cfg.apps.push(this.name);

      this.config.set('apps', this.cfg.apps);

    } else {
      this.config.defaults({
        project: this.appname,
        apps: [this.app],
        coffee: this.coffee
//        stylus: this.stylus,
//        jade: this.jade
      });
    }

    this.config.save();
  },

  // Project generation
  project: function () {

    if (this.appMode) {
      return;
    }

    var js    = this.coffee ? 'coffee': 'js';

    this.mkdir('components');

    this.mkdir('config');
    this.template('config/_defaults.json', 'config/defaults.json');

    if (this.login){
      this.template('config/_login.'+js, 'config/login.'+js);
    }

    this.mkdir('test');

    this.mkdir('public');
    this.mkdir('public/img');
    this.copy('public/img/favicon.ico', 'public/img/favicon.ico');

    this.mkdir('server');
    this.copy('server/error.'+js, 'server/error.'+js);
    this.copy('server/routes.'+js, 'server/routes.'+js);
    this.copy('server/config.'+js, 'server/config.'+js);
    this.template('server/_express.' + js, 'server/express.'+js);
    this.template('server/_store.' + js, 'server/store.'+js);

    if (this.schema) {
      this.mkdir('server/model');
      this.copy('server/schema.'+js, 'server/schema.'+js);
      this.copy('server/model/auths.'+js, 'server/model/auths.'+js);
      this.copy('server/model/products.'+js, 'server/model/products.'+js);
    }

    this.mkdir('apps');

//    this.mkdir('views');

    this.template('_server.'+js, 'server.'+js);

    this.template('_package.json', 'package.json');

    if (this.win) this.template('_npm-shrinkwrap.json', 'npm-shrinkwrap.json');

    if (this.bower) {
      this.mkdir('bower_components');
      this.template('_.bowerrc', '.bowerrc');
      this.template('_bower.json', 'bower.json');
    }

    this.template('_.gitignore', '.gitignore');
    this.template('_README.md', 'README.md');
  },

  projectDependencies: function(){

    if (this.appMode) {
      return;
    }

    this.npm = [
      // Derby
      'derby@0.7.1',

      'sharedb-mongo',
      'racer-bundle',
      'racer-highway',

      // Coffee-script support
      'coffeeify',
      'coffee-script',

      // Utilities
      'async',
      'chalk',

      // Express
      'express',
      'connect-mongo',
      'cookie-parser',
      'body-parser',
      'express-session',
      'serve-static',
      'compression',
      'serve-favicon'
    ];

    if (this.yamlify) {
      this.npm.push('yamlify');
    }

    if (this.login) {
      this.npm.push('derby-login');
    }

    if (this.loginGithub){
      this.npm.push('passport-github');
    }

    if (this.loginGoogle){
      this.npm.push('passport-google-oauth');
    }

    if (this.loginLinkedIn) {
      this.npm.push('passport-linkedin');
    }

    if (this.loginFacebook) {
      this.npm.push('passport-facebook');
    }

    if (this.loginVkontakte) {
      this.npm.push('passport-vkontakte');
    }

    if (this.schema) {
      this.npm.push('racer-schema');
    }

    if (this.redis) {
      this.npm.push('redis-url');
      this.npm.push('sharedb-redis-pubsub');
    }

  },

  // Error-app generation
  err: function(){

    if (this.appMode) {
      return;
    }

    var js    = this.coffee ? 'coffee': 'js';
    var html  = this.jade ? 'jade': 'html';
    var css   = this.stylus?  'styl': 'css';

    this.mkdir('apps/error');
    this.template('apps/error/_index.' + js, 'apps/error/index.'+js);

    this.mkdir('apps/error/views');
    this.copy('apps/error/views/index.'+html, 'apps/error/views/index.'+html);
    this.copy('apps/error/views/403.'+html, 'apps/error/views/403.'+html);
    this.copy('apps/error/views/404.'+html, 'apps/error/views/404.'+html);
    this.copy('apps/error/views/500.'+html, 'apps/error/views/500.'+html);


    this.mkdir('apps/error/styles');
    this.copy('apps/error/styles/index.'+css, 'apps/error/styles/index.'+css);
    this.copy('apps/error/styles/reset.'+css, 'apps/error/styles/reset.'+css);

  },
  // App generation
  app: function () {
    var boot = this.bootstrap ? 'bootstrap.' : '';

    var js    = this.coffee ? 'coffee': 'js';
    var html  = this.jade ? 'jade': 'html';
    var css   = this.stylus?  'styl': 'css';

    var appPath = 'apps/'+this.app;

    this.mkdir(appPath);
    this.template( 'apps/app/_index.' + js, appPath + '/index.'+js);

    this.mkdir(appPath + '/views');

    this.template('apps/app/views/_index.' + boot + html, appPath + '/views/index.'+html);
    this.template('apps/app/views/_home.' + boot + html, appPath + '/views/home.'+html);

    if (this.login && this.bootstrap){
      this.template('apps/app/views/_login.' + boot + html, appPath + '/views/login.'+html);
      this.template('apps/app/views/_register.' + boot + html, appPath + '/views/register.'+html);
    }


    this.mkdir(appPath + '/styles');
    this.copy('apps/app/styles/index.' + boot + css, appPath + '/styles/index.'+css);

  },

  readProjectPackage: function(){

    var projectPackage = require(this.dest._base + '/package.json');
    this.dependencies = Object.keys(projectPackage.dependencies);
  },

  _addNpmPackage: function(pack){
    if (this.dependencies.indexOf(pack) === -1) {
      this.npm = this.npm || [];
      this.npm.push(pack);
    }
  },

  appDependencies: function(){

    this.npm = this.npm || [];

    this._addNpmPackage('derby-debug');

    if (this.jade) {
      this._addNpmPackage('derby-jade');
    }

    if (this.stylus) {
      this._addNpmPackage('derby-stylus');
    }

    if (this.bootstrap) {
      this._addNpmPackage('d-bootstrap');
    }

    if (this.md) {
      this._addNpmPackage('derby-markdown');
    }

    if (this.router) {
      this._addNpmPackage('derby-router');
    }
  },

  installDependencies: function() {

    var self = this;

    if (!this.options['skip-install']) {
      var done = this.async();

      self.log('\n\nI\'m all done. ' + 'Running ' + chalk.yellow.bold('npm install\n'));

      this.npmInstall(this.npm, {save: true}, function(){
        self.log('\nAll is done, to start app use: ' + chalk.yellow.bold('npm start\n'));
        done();
      });
    }

  },

  addAppToProjecnt: function(){
    var js, needle, splicable;


    if (!this.appMode) {
      return;
    }

    if (this.coffee) {
      js = 'coffee';
      needle = '# <end of app list> - don\'t remove this comment';
      splicable = '    require \'./apps/' + this.name + '\'';

    } else {
      js = 'js';
      needle = '// <end of app list> - don\'t remove this comment';
      splicable = '  , require(\'./apps/' + this.name + '\')';
    }

    generatorUtil.rewriteFile({
      file: 'server.'+js,
      needle: needle,
      splicable: [splicable]
    });
  }

});

module.exports = DerbyGenerator;
