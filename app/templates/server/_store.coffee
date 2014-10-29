liveDbMongo = require 'livedb-mongo'
coffeeify = require 'coffeeify'<% if (yamlify) { %>
yamlify = require 'yamlify'<% } %>

module.exports = (derby, publicDir) ->
  mongo = liveDbMongo process.env.MONGO_URL + '?auto_reconnect', {safe: true}
  derby.use require 'racer-bundle'<% if (schema) { %>
  derby.use require('racer-schema'), require('./schema')<% } %>
<% if (redis) { %>
  redis = require 'redis-url'
  livedb = require 'livedb'

  redisDriver = livedb.redisDriver mongo, redis.connect(), redis.connect()

  store = derby.createStore
    backend: livedb.client driver: redisDriver, db: mongo

<% } else { %>

  store = derby.createStore db: mongo
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

