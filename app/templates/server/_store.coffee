shareDbMongo = require 'sharedb-mongo'
coffeeify = require 'coffeeify'<% if (yamlify) { %>
yamlify = require 'yamlify'<% } %>

module.exports = (derby, publicDir) ->
  db = shareDbMongo process.env.MONGO_URL + '?auto_reconnect=true', {safe: true}
  derby.use require 'racer-bundle'<% if (schema) { %>
  derby.use require('racer-schema'), require('./schema')<% } %>
<% if (redis) { %>
  redis = require 'redis-url'
  redisPubSub = require 'sharedb-redis-pubsub'

  pubsub = redisPubSub client: redis.connect(), observer: redis.connect()

  store = derby.createStore {db, pubsub}

<% } else { %>

  store = derby.createStore {db}
<% } %>
  store.on 'bundle', (browserify) ->

    browserify.transform {global: true}, coffeeify<% if (yamlify) { %>
    browserify.transform {global: true}, yamlify<% } %>

    pack = browserify.pack

    browserify.pack = (opts) ->
      detectTransform = opts.globalTransform.shift()
      opts.globalTransform.push detectTransform
      pack.apply this, arguments

  store

