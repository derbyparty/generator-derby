var liveDbMongo = require('livedb-mongo');
var coffeeify = require('coffeeify');<% if (yamlify) { %>
var yamlify = require('yamlify');<% } %>

module.exports = store;

function store(derby, publicDir) {
  var mongo = liveDbMongo(process.env.MONGO_URL + '?auto_reconnect', {safe: true});

  derby.use(require('racer-bundle'));<% if (schema) { %>
  derby.use(require('racer-schema'), require('./schema'));<% } %>
<% if (redis) { %>
  var redis = require('redis');
  var livedb = require('livedb');
  var redisClient = redis.createClient();
  var redisObserver = redis.createClient();

  redisClient.select(process.env.REDIS_DB);
  redisObserver.select(process.env.REDIS_DB);

  var redisDriver = livedb.redisDriver(mongo, redisClient, redisObserver);

  var store = derby.createStore({
    backend: livedb.client({driver: redisDriver, db: mongo})
  });
<% } else { %>

  var store = derby.createStore({db: mongo});
<% } %>
  store.on('bundle', function(browserify) {

    browserify.transform({global: true}, coffeeify);<% if (yamlify) { %>
    browserify.transform({global: true}, yamlify);<% } %>

    var pack = browserify.pack;
    browserify.pack = function(opts) {
      var detectTransform = opts.globalTransform.shift();
      opts.globalTransform.push(detectTransform);
      return pack.apply(this, arguments);
    };
  });

  return store;
}