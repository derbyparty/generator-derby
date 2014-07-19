'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var crypto = require('crypto');
var updateNotifier = require('update-notifier');

var DerbyGenerator = yeoman.generators.Base.extend({
  init: function () {
    var self = this;
    this.pkg = require('../package.json');
    updateNotifier({packageName: this.pkg.name, packageVersion: this.pkg.version}).notify();

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
        name: 'Jade', //app level
        value: 'jade',
        checked: true
      },{
        name: 'Stylus', //app level
        value: 'stylus',
        checked: true
      },{
        name: 'Redis', //proj level
        value: 'redis',
        checked: false
      },{
        name: 'Bootstrap 3', //app level
        value: 'bootstrap',
        checked: false
      },{
        name: 'Derby-login', //proj level / app level
        value: 'login',
        checked: false
      },{
        name: 'Racer-schema', //proj level
        value: 'schema',
        checked: false
      },{
        name: 'Bower', //proj level
        value: 'bower',
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

      this.jade    = hasFeature('jade');
      this.stylus  = hasFeature('stylus');
      this.redis   = hasFeature('redis');
      this.login   = hasFeature('login');
      this.bootstrap  = hasFeature('bootstrap');
      this.schema  = hasFeature('schema');
      this.bower = hasFeature('bower');

      this.loginGithub = hasLoginPackage('loginGithub');
      this.loginGoogle = hasLoginPackage('loginGoogle');
      this.loginLinkedIn = hasLoginPackage('loginLinkedIn');
      this.loginFacebook = hasLoginPackage('loginFacebook');
      this.loginVkontakte = hasLoginPackage('loginVkontakte');

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

  project: function () {
    var js    = this.coffee ? 'coffee': 'js';

    this.mkdir('components');

    this.mkdir('config');
    this.template('config/_defaults.json', 'config/defaults.json');

    if (this.login){
      this.template('config/_login.'+js, 'config/login.'+js);
    }

    this.mkdir('test');

    this.mkdir('public');
    this.mkdir('server');
    this.copy('server/error.'+js, 'server/error.'+js);
    this.copy('server/routes.'+js, 'server/routes.'+js);
    this.template('server/_express.' + js, 'server/express.'+js);
    this.template('server/_store.' + js, 'server/store.'+js);

    if (this.schema) {
      this.mkdir('server/model');
      this.copy('server/schema.'+js, 'server/schema.'+js);
      this.copy('server/model/products.'+js, 'server/model/products.'+js);
    }

    this.mkdir('src');

    this.mkdir('views');

    this.template('_server.'+js, 'server.'+js);

    this.template('_package.json', 'package.json');

    if (this.bower) {
      this.mkdir('bower');
      this.template('_.bowerrc', '.bowerrc');
      this.template('_bower.json', 'bower.json');
    }

    this.template('_.gitignore', '.gitignore');
    this.template('_README.md', 'README.md');
  },

  err: function(){
    var js    = this.coffee ? 'coffee': 'js';
    var html  = this.jade ? 'jade': 'html';
    var css   = this.stylus?  'styl': 'css';

    this.mkdir('src/error');
    this.template('src/error/_index.' + js, 'src/error/index.'+js);

    this.mkdir('views/error');
    this.copy('views/error/index.'+html, 'views/error/index.'+html);
    this.copy('views/error/403.'+html, 'views/error/403.'+html);
    this.copy('views/error/404.'+html, 'views/error/404.'+html);
    this.copy('views/error/500.'+html, 'views/error/500.'+html);


    this.mkdir('styles');
    this.mkdir('styles/error');
    this.copy('styles/error/index.'+css, 'styles/error/index.'+css);
    this.copy('styles/error/reset.'+css, 'styles/error/reset.'+css);

  },
  app: function () {
    var js    = this.coffee ? 'coffee': 'js';
    var html  = this.jade ? 'jade': 'html';
    var css   = this.stylus?  'styl': 'css';

    this.mkdir('src/app');
    this.template('src/app/_index.' + js, 'src/app/index.'+js);

    this.mkdir('views/app');
    this.copy('views/app/index.'+html, 'views/app/index.'+html);
    this.copy('views/app/home.'+html, 'views/app/home.'+html);

    this.mkdir('styles/app');
    this.copy('styles/app/index.'+css, 'styles/app/index.'+css);

  }

});

module.exports = DerbyGenerator;
