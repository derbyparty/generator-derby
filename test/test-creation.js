/*global describe, before, it */
'use strict';
var path = require('path');
var assert = require('assert');

// lodash from yeoman
var _ = require('yeoman-generator/lib/actions/string')._;
var helpers = require('yeoman-generator').test;

var common = require('./common');

var setup = function(config){
  return function(done){
    helpers.testDirectory(
      path.join(__dirname, 'temp'),
      function (err) {
        if (err) {
          return done(err);
        }

        this.config = _.merge({
          args: [],
          options: {},
          prompts: {},
          expected: []
        }, config);

        this.app = helpers.createGenerator(
          'derby:app', ['../../app'],
          this.config.args,
          this.config.options
        );

        helpers.mockPrompt(this.app, this.config.prompts);

        this.app.run({}, function () {
          done();
        });
      }.bind(this)
    );
  };
};

var expected = function(){
  it('creates expected files', function(){
    helpers.assertFile(this.config.expected);
  });
};

var lint = function(){
  it('creates well-formed files', function(done){
    common.lint(this.config.expected, function(err, errors){
      assert.deepEqual(JSON.stringify(errors), '[]');
      done();
    });
  });
};

var baseConfig = function(){
  return {
    expected: [
      // add files you expect to exist here.'config/defaults.json',
      'server/error.js',
      'server/index.js',
      'src/app/index.js',
      'src/error/index.js',
      'views/app/index.html',
      'views/app/home.html',
      'views/error/index.html',
      'views/error/403.html',
      'views/error/404.html',
      'views/error/500.html',
      'styles/app/index.css',
      'styles/error/index.css',
      'styles/error/reset.css',
      'server.js',
      'package.json',
      'README.md'
    ],
    options: common.opts,
    prompts: {
      features: []
    }
  };
};


describe('derby generator', function () {
  describe('with baseline config', function () {
    before(setup(baseConfig()));
    expected.call(this);
    lint.call(this);
  });

  describe('with `stylus`', function () {
    var config = _.extend({}, baseConfig(), {prompts: {features: ['stylus']}});
    config.expected = common.arrReplace(config.expected, /\.css$/, '.styl');

    before(setup(config));
    expected.call(this);
    lint.call(this);
  });

  describe('with `jade`', function () {
    var config = _.extend({}, baseConfig(), {prompts: {features: ['jade']}});
    config.expected = common.arrReplace(config.expected, /\.html$/, '.jade');

    before(setup(config));
    expected.call(this);
    lint.call(this);
  });

  describe('with `coffee`', function () {
    var config = _.merge({}, baseConfig(), {options: {coffee: true}});
    config.expected = common.arrReplace(config.expected, /\.js$/, '.coffee');

    before(setup(config));
    expected.call(this);
    lint.call(this);
  });


});
