'use strict';

//var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('yeoman-generator/lib/actions/string')._;

var Generator = yeoman.generators.NamedBase.extend({
  init: function () {
    this.component = this.name;

    this.log(
        chalk.yellow('Derby 0.6 Component Generator for ') +
        chalk.cyan(this.component)
    );

    this.config.loadConfig();
    this.cfg = this.config.getAll();

    this.destinationRoot(this.env.cwd);

    this.option('coffee', {
      desc: 'Use CoffeeScript',
      type: Boolean,
      defaults: false
    });

    this.coffee = this.options.coffee;



    this.standalone = this.name.indexOf('d-') === 0;

    // name the class
    this.className = _.classify(this.standalone ? this.name.slice(2) : this.name);

    this.email = this.user.git.email;
    this.username = this.user.git.username;
  },

  askFor: function () {
    var done = this.async();

    this.log(
      chalk.yellow('The class will be called ') +
      chalk.cyan(this.className)
    );

    if(this.cfg.project){
      this.log(
        chalk.cyan('I\'ve found Derby project named ') +
        chalk.yellow(this.cfg.project)
      );

      if (typeof this.coffee === 'undefined') {
        this.coffee = this.cfg.coffee;
      }
    }

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'Select preprocessors',
      choices: [{
          name: 'Jade (HTML)',
          value: 'jade',
          checked: true
        },{
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

      console.log('hello', features);

      this.jade    = hasFeature('jade');
      this.stylus  = hasFeature('stylus');

      done();
    }.bind(this));
  },

  component: function () {
    var js    = this.coffee ? 'coffee': 'js';
    var html  = this.jade ? 'jade': 'html';
    var css   = this.stylus ?  'styl': 'css';

//    console.log('js', js, this.options.coffee);

    var name = this.component;

    this.mkdir(name);

    if (!this.standalone) {
      this.template('src/_component.' + js, name + '/' + name + '.' + js);
      this.template('src/_component.' + css, name + '/' + name + '.' + css);
      this.template('src/_component.' + html, name + '/' + name + '.' + html);

      return;
    }

    this.template('src/_component.' + js, name + '/index.' + js);
    this.template('src/_component.' + css, name + '/index.' + css);
    this.template('src/_component.' + html, name + '/index.' + html);

    this.template('_README.md', name + '/README.md');
    this.template('_package.json', name + '/package.json');

  }
});

module.exports = Generator;

//function dashToCamel(string) {
//  return string.replace(/-./g, function(match) {
//    return match.charAt(1).toUpperCase();
//  });
//}
//
//function camelToDash(str) {
//  return str.replace(/[a-z][A-Z]/g, function(str) {
//    return str[0] + '-' + str[1].toLowerCase();
//  });
//}
//
//function capitaliseFirstLetter(string){
//  return string.charAt(0).toUpperCase() + string.slice(1);
//}