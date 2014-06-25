var express = require('express');

var session = require('express-session');
var serveStatic = require('serve-static');
var compression = require('compression');
var cookieParser = require('cookie-parser');

var derby = require('derby');

var app = require('../src/app');

var path = require('path');
var coffeeify = require('coffeeify');

var racerBrowserChannel = require('racer-browserchannel');
var liveDbMongo = require('livedb-mongo');
var racerBundle = require('racer-bundle');

var error = require('./error');

var mongoUrl = process.env.MONGO_URL;

var connectStore = require('connect-mongo')(session);
var sessionStore = new connectStore({url: mongoUrl});
<% if (redis) { %>
var redisClient = require('redis').createClient();
redisClient.select(process.env.REDIS_DB);

store = derby.createStore({
  db: liveDbMongo(mongoUrl + '?auto_reconnect', {safe: true}),
  redis: redisClient
});
<% } else { %>
store = derby.createStore({db: liveDbMongo(mongoUrl + '?auto_reconnect', {safe: true})});
<% } %>
derby.use(racerBundle);

var publicDir = path.join(__dirname, '/../public');

store.on('bundle', function (browserify) {

  browserify.transform({global: true}, coffeeify);

  var pack = browserify.pack;
  browserify.pack = function (opts) {
    var detectTransform = opts.globalTransform.shift();
    opts.globalTransform.push(detectTransform);
    return pack.apply(this, arguments);
  };
});

var expressApp = module.exports = express()
  .use(compression())
  .use(serveStatic(publicDir))
  .use(racerBrowserChannel(store))
  .use(store.modelMiddleware())
  .use(cookieParser())
  .use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    cookie: process.env.SESSION_COOKIE
  }))
  .use(createUserId)
  .use(app.router())
  .all('*', function (req, res, next) {
    next('404: ' + req.url);
  })
  .use(error);

app.writeScripts(store, publicDir, {<% if (coffee) { %>extensions: ['.coffee']<% } %>}, function(){});

function createUserId(req, res, next) {
  var model = req.getModel();
  var userId = req.session.userId;
  if (!userId) userId = req.session.userId = model.id();
  model.set('_session.userId', userId);
  next();
}