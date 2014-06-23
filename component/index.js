'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var _ = require('yeoman-generator/lib/actions/string')._;

var Generator = module.exports = yeoman.generators.NamedBase.extend({
  init: function () {
    var self = this;
    
    this.config.loadConfig();
    
    this.on('end', function () {
      // if this was a subcomponent, we are done
      if(!this.config.get("app")){ return; }
      
      this.config.save();
      
      if (!this.options['skip-install']) {
        this.installDependencies({callback: function(){
          self.log('\The component is ready to be customized!');
        }});
      }
    });

    this.option('coffee', {
      desc: 'Use CoffeeScript',
      type: Boolean,
      defaults: false
    });
    
    this.coffee = this.options.coffee;
    
    this.email = this.user.git.email;
    this.username = this.user.git.username;
  },

  askFor: function () {
    var done = this.async();
    var app = this.config.get("app");
    
    this.log(
      chalk.yellow('Derby 0.6 Component Generator for ') +
      chalk.red('d-' + _.slugify(this.name))
    );
    
    if(app){
      this.log(
        chalk.cyan('I\'ve loaded these from your app named ') + 
        chalk.yellow(app)
      );
    }else{
      this.config.defaults({
        component: 'd-' + _.slugify(this.name),
        jade: true,
        coffee: true,
        stylus: true
      });
    }

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'Select preprocessors',
      choices: [
        {
          name: 'Jade (HTML)',
          value: 'jade',
          checked: this.config.get('jade')
        },
        {
          name: 'Stylus (CSS)',
          value: 'stylus',
          checked: this.config.get('stylus')
        }
      ]
    }];

    this.prompt(prompts, function (answers) {
      var features = answers.features || [];
      prompts[0].choices.forEach(function(feature){
        var val = feature.value;
        this.config.set(
          val,
          this[val] = features.indexOf(val) !== -1
        );
        
      }.bind(this));
      done();
    }.bind(this));
  },

  component: function () {
    var js = this.coffee ? 'coffee': 'js';
    var html = this.jade ? 'jade': 'html';
    var css = this.stylus ?  'styl': 'css';
    var name = 'd-' + _.slugify(this.name);
    var src = this.coffee ? "src" : "lib";
    
    var srcDir = function(p){ return path.join(src, name, p); };
  
    if(!this.config.get("app")){
      this.template('_package.json', 'package.json');
      this.template('_bower.json', 'bower.json');
      this.template('_README.md', 'README.md');
      this.template('_index.js', 'index.js');
    }else{
      srcDir = function(p){
        return path.join('src', 'components', name, p);
      };
      this.template('_README.md', srcDir('README.md'));
    }
    this.template('src/_index.' + js, srcDir('index.' + js));
    this.template('src/_index.' + css, srcDir('index.' + css));
    this.template('src/_index.' + html, srcDir('index.' + html));
  }
});
