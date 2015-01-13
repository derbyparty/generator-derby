'use strict';

//var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('yeoman-generator/lib/actions/string')._;

var Generator = yeoman.generators.Base.extend({
  init: function () {
    var self = this;

    this.log('\nDerby 0.6 Mini-project generator:\n');

    this.config.loadConfig();
    this.cfg = this.config.getAll();

    this.destinationRoot(this.env.cwd);

    this.email = this.user.git.email;
    this.username = this.user.git.username;

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies({
          bower: false,
          callback: function(){
            self.log('\nAll is done, to start app use: ' + chalk.yellow('npm start\n'));
          }
        });
      }
    });

  },


  handleTemplates: function () {

    this.template('_.gitignore', '.gitignore');
    this.template('_index.html', 'index.html');
    this.template('_index.js', 'index.js');
    this.template('_server.js', 'server.js');
    this.template('_package.json', 'package.json');
  }
});

module.exports = Generator;

