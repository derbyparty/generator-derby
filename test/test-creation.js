/*global describe, before, it */
'use strict';
var path = require('path');
var assert = require('assert');

// lodash from yeoman
var _ = require('yeoman-generator/lib/actions/string')._;
var helpers = require('yeoman-generator').test;

var common = require('./common');

function runGenerator(context, config, done){
  context.config = _.merge({
    args: [],
    options: {},
    prompts: {},
    expected: []
  }, config);

  context.generator = helpers.createGenerator(
    context.config.generator,
    context.config.deps,
    context.config.args,
    context.config.options
  );

  helpers.mockPrompt(context.generator, context.config.prompts);

  context.generator.run({}, function () {
    done();
  });
}

function setup(config){
  return function(done){
    helpers.testDirectory(
      path.join(__dirname, 'temp'),
      function (err) {
        if (err) {
          return done(err);
        }

        runGenerator(this, config, done);
      }.bind(this)
    );
  };
}

function setupSub(config){
  return function(done){
    runGenerator(this, config, done);
  };
}

function expected(){
  it('creates expected files', function(){
    helpers.assertFile(this.config.expected);
  });
}

function lint(){
  it('creates well-formed files', function(done){
    common.lint(this.config.expected, function(err, errors){
      assert.deepEqual(JSON.stringify(errors), '[]');
      done();
    });
  });
}

var base = {
  app: {
    generator: 'derby:app',
    deps: ['../../app'],
    expected: [
        // add files you expect to exist here.
        'config/defaults.json',
        'server/error.js',
        'server/express.js',
        'server/store.js',
        'server/routes.js',
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
  },
  component: {
    generator: 'derby:component',
    deps: ['../../component'],
    args: ['Component X'],
    expected: [
      'package.json',
      'README.md',
      'lib/component-x.js',
      'lib/component-x.css',
      'lib/component-x.html'
    ],
    options: common.opts,
    prompts: {
      features: []
    }
  },
  subcomponent: {
    generator: 'derby:component',
    deps: ['../../component'],
    args: ['Component X'],
    expected: [
//      'components/component-x/README.md',
      'components/component-x/component-x.js',
      'components/component-x/component-x.css',
      'components/component-x/component-x.html'
    ],
    options: common.opts,
    prompts: {
      features: []
    }
  }
};


describe('derby app generator', function () {
  describe('with baseline config', function () {
    before(setup(base.app));
    expected.call(this);
    lint.call(this);
  });

  describe('with `stylus`', function () {
    var config = _.extend({}, base.app, {prompts: {features: ['stylus']}});
    config.expected = common.arrReplace(config.expected, /\.css$/, '.styl');

    before(setup(config));
    expected.call(this);
    lint.call(this);
  });

  describe('with `jade`', function () {
    var config = _.extend({}, base.app, {prompts: {features: ['jade']}});
    config.expected = common.arrReplace(config.expected, /\.html$/, '.jade');

    before(setup(config));
    expected.call(this);
    lint.call(this);
  });

  describe('with `coffee`', function () {
    var config = _.merge({}, base.app, {options: {coffee: true}});
    config.expected = common.arrReplace(config.expected, /\.js$/, '.coffee');

    before(setup(config));
    expected.call(this);
    lint.call(this);
  });
});


describe('derby standalone component generator', function () {
  describe('with baseline config', function () {
    before(setup(base.component));
    expected.call(this);
    lint.call(this);
  });

  describe('with `jade`', function () {
    var config = _.extend({}, base.component, {prompts: {features: ['jade']}});
    config.expected = common.arrReplace(config.expected, /\.html$/, '.jade');

    before(setup(config));
    expected.call(this);
    lint.call(this);
  });

  describe('with `stylus`', function () {
    var config = _.extend({}, base.component,
      {prompts: {features: ['stylus']}});
    config.expected = common.arrReplace(config.expected, /\.css$/, '.styl');

    before(setup(config));
    expected.call(this);
    lint.call(this);
  });

  describe('with `coffee`', function () {
    var config = _.merge({}, base.component, {options: {coffee: true}});
    config.expected = common.arrReplace(config.expected, /\.js$/, '.coffee');
//    config.expected = common.arrReplace(config.expected, /lib\//, 'src/');

    before(setup(config));
    expected.call(this);
    lint.call(this);
  });
});

describe('derby subcomponent generator', function () {
  describe('in a baseline app', function () {
    before(setup(base.app));
    describe('a component', function () {
      before(setupSub(base.subcomponent));
      expected.call(this);
      lint.call(this);
    });
  });

  describe('in a `jade` app', function(){
    before(setup(_.merge({}, base.app, {prompts: {features: ['jade']}})));
    describe('a component', function () {
      var config = _.merge({}, base.subcomponent);
      config.expected = common.arrReplace(config.expected, /\.html$/, '.jade');
      before(setupSub(config));
      expected.call(this);
      lint.call(this);
    });
  });

  describe('in a `stylus` app', function(){
    before(setup(_.merge({}, base.app, {prompts: {features: ['stylus']}})));
    describe('a component', function () {
      var config = _.merge({}, base.subcomponent);
      config.expected = common.arrReplace(config.expected, /\.css$/, '.styl');
      before(setupSub(config));
      expected.call(this);
      lint.call(this);
    });
  });

  describe('in a `coffee` app', function(){
    before(setup(_.merge({}, base.app, {options: {coffee: true}})));
    describe('a component', function () {
      var config = _.merge({}, base.subcomponent);
      config.expected = common.arrReplace(config.expected, /\.js$/, '.coffee');
      before(setupSub(config));
      expected.call(this);
      lint.call(this);
    });
  });

});