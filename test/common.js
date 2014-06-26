var fs = require('fs'),
  path = require('path'),
  _ = require('yeoman-generator/lib/actions/string')._,
  async = require('async'),
  jshint = require('jshint').JSHINT,
  coffeelint = require('coffeelint'),
  recess = require('recess'),
  stylus = require('stylus').render,
  jsonlint = require('jsonlint').parse,
  jade = (function(fakeApp){
      require('derby-jade')(fakeApp);
      return fakeApp.compilers[".jade"];
    })({viewExtensions: [], compilers: {}});


var common = module.exports = {};

// defaults passed as --<whatever>
common.opts = {
  'skip-install': true,
  'skip-messages': true
};



common.arrReplace = function(arr, pattern, replacement){
  return arr.map(function(str){
    return str.replace(pattern, replacement);
  });
};



// everybody has their own format
common.linters = {
  coffee: function (file, done) {
    fs.readFile(file, {encoding: 'utf-8'}, function(err, src){
      var errors = coffeelint.lint(src);
      done(null, errors.length ? [file, errors] : null);
    });
  },
  js: function (file, done) {
    fs.readFile(file, function(err, src){
      var errors = jshint(src);
      done(null, errors ? [file, jshint.errors] : null);
    });
  },
  css: function (file, done) {
    recess([file], {}, function(err){
      done(null, err ? [file, err] : null);
    });
  },
  json: function (file, done) {
    fs.readFile(file, {encoding: 'utf-8'}, function(err, src){
      var errors;
      try{
        jsonlint(src);
      }catch(err){
        errors = err.message;
      }
      done(null, errors ? [file, errors] : null);
    });
  },
  styl: function (file, done) {
    fs.readFile(file, {encoding: 'utf-8'}, function(err, src){
      stylus(src, {}, function(err){
        done(null, err ? [file, err] : null);
      });
    });
  },
  jade: function(file, done) {
    fs.readFile(file, {encoding: 'utf-8'}, function(err, src){
      var errors;
      try{
        jade(src, file);
      }catch(err){
        errors = err.message;
      }
      done(null, errors ? [file, errors] : null);
    });
  }
};


// asynchronously lint the set of files against known linters
common.lint = function (files, done) {
  async.map(
    files,
    function (file, done ){
      var linter = common.linters[path.extname(file).slice(1)];
      return linter ? linter(file, done) : done();
    },
    function(err, results){
      done(err, _.compact(results));
    }
  );
};
