'use strict';

var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('yeoman-generator/lib/actions/string')._;

var Generator = yeoman.generators.NamedBase.extend({
  init: function () {
    this.config.loadConfig();
    var cfg = this.config.getAll();

    this.option('coffee', {
      desc: 'Use CoffeeScript',
      type: Boolean,
      defaults: false
    });

    // is this already inside an app?
    this.app = cfg.app;

    // add the derby `d-` namespace for standalone components
    this.component = _.slugify(this.name);
    this.pkgName = (cfg.app ? '' : 'd-') + this.component;

    // name the class
    this.className = _.classify(_.slugify(this.name));

    this.coffee = this.options.coffee;

    this.email = this.user.git.email;
    this.username = this.user.git.username;
  },

  askFor: function () {
    var done = this.async();
    var cfg = this.config.getAll();

    this.log(
      chalk.yellow('Derby 0.6 Component Generator for ') +
      chalk.cyan(this.component)
    );

    this.log(
      chalk.yellow('The class will be called ') +
      chalk.cyan(this.className)
    );

    if(cfg.app){
      this.log(
        chalk.cyan('I\'ve found an app named ') +
        chalk.yellow(cfg.app)
      );

      this.coffee = cfg.coffee;
      this.jade   = cfg.jade;
      this.stylus = cfg.stylus;

      done();
    }else{

      var prompts = [{
        type: 'checkbox',
        name: 'features',
        message: 'Select preprocessors',
        choices: [
          {
            name: 'Jade (HTML)',
            value: 'jade',
            checked: true
          },
          {
            name: 'Stylus (CSS)',
            value: 'stylus',
            checked: true
          }
        ]
      }];

      this.prompt(prompts, function (answers) {
        var features = answers.features || [];

        function hasFeature(feat) {
          return features && features.indexOf(feat) !== -1;
        }

        this.jade    = hasFeature('jade');
        this.stylus  = hasFeature('stylus');

        this.config.defaults({
          coffee: this.coffee,
          jade: this.jade,
          stylus: this.stylus
        });

        this.config.save();

        done();
      }.bind(this));

    }
  },

  component: function () {
    var js = this.coffee ? 'coffee': 'js';
    var html = this.jade ? 'jade': 'html';
    var css = this.stylus ?  'styl': 'css';
    var src = this.coffee ? 'src' : 'lib';

    var name = this.component;

    var srcDir = function(p){ return path.join(src, name, p); };

    if(!this.config.get('app')){
      this.template('_package.json', 'package.json');
      this.template('_bower.json', 'bower.json');
      this.template('_README.md', 'README.md');
//      this.template('_index.js', 'index.js');
    }else{
      srcDir = function(p){
//        return path.join('src', 'app', 'components', name, p);
        return path.join('components', name, p);
      };
      this.template('_README.md', srcDir('README.md'));
    }
//    this.template('src/_index.' + js, srcDir('index.' + js));
    this.template('src/_component.' + js, srcDir(name + '.' + js));
    this.template('src/_component.' + css, srcDir(name + '.' + css));
    this.template('src/_component.' + html, srcDir(name + '.' + html));

  }
});

module.exports = Generator;
