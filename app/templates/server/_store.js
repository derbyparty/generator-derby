var shareDbMongo = require('sharedb-mongo');
var coffeeify = require('coffeeify');<% if (yamlify) { %>
var yamlify = require('yamlify');<% } %>

module.exports = store;

function store(derby, publicDir) {
  var db = shareDbMongo(process.env.MONGO_URL + '?auto_reconnect', {safe: true});

  derby.use(require('racer-bundle'));<% if (schema) { %>
  derby.use(require('racer-schema'), require('./schema'));<% } %>
<% if (redis) { %>
  var redis = require('redis-url');
  var redisPubSub = require('sharedb-redis-pubsub');

  var pubsub = redisPubSub({
    client: redis.connect(),
    observer: redis.connect()
  });

  var store = derby.createStore({
    db: db,
    pubsub: pubsub
  });
<% } else { %>

  var store = derby.createStore({db: db});
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
