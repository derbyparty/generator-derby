var liveDbMongo = require('livedb-mongo');
var coffeeify = require('coffeeify');

module.exports = store;

function store(derby) {

  derby.use(require('racer-bundle'));
<% if (redis) { %>
  var redisClient = require('redis').createClient();
  redisClient.select(process.env.REDIS_DB);

  var store = derby.createStore({
    db: liveDbMongo(process.env.MONGO_URL + '?auto_reconnect', {safe: true}),
    redis: redisClient
  });
<% } else { %>
  var opts = {db: liveDbMongo(process.env.MONGO_URL + '?auto_reconnect', {safe: true})};

  var store = derby.createStore(opts);
<% } %>
  store.on('bundle', function(browserify) {

    browserify.transform({global: true}, coffeeify);

    var pack = browserify.pack;
    browserify.pack = function(opts) {
      var detectTransform = opts.globalTransform.shift();
      opts.globalTransform.push(detectTransform);
      return pack.apply(this, arguments);
    };
  });

  return store;
}