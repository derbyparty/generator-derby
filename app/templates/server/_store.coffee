liveDbMongo = require 'livedb-mongo'
coffeeify = require 'coffeeify'<% if (yamlify) { %>
yamlify = require 'yamlify'<% } %>

module.exports = (derby, publicDir) ->
  mongo = liveDbMongo process.env.MONGO_URL + '?auto_reconnect', {safe: true}
  derby.use require 'racer-bundle'<% if (schema) { %>
  derby.use require('racer-schema'), require('./schema')<% } %>
<% if (redis) { %>
  redis = require 'redis'
  livedb = require 'livedb'
  redisClient = redis.createClient()
  redisObserver = redis.createClient()

  redisClient.select process.env.REDIS_DB
  redisObserver.select process.env.REDIS_DB

  redisDriver = livedb.redisDriver mongo, redisClient, redisObserver

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

