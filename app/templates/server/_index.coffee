express = require 'express'

session = require 'express-session'
serveStatic = require 'serve-static'
compression = require 'compression'
cookieParser = require 'cookie-parser'

derby = require 'derby'

app = require '../src/app'

path = require 'path'<% if (coffee) { %>
coffeeify = require 'coffeeify' <% } %>

racerBrowserChannel = require 'racer-browserchannel'
liveDbMongo = require 'livedb-mongo'
racerBundle = require 'racer-bundle'

error = require './error'

createUserId = (req, res, next) ->
  model = req.getModel()
  userId = req.session.userId
  if not userId
    userId = req.session.userId = model.id()
  model.set '_session.userId', userId
  next()

module.exports = (cb) ->
  <% if (includeRedis) { %>
  redis = require 'redis'

  redisClient = redis.createClient process.env.REDIS_PORT, process.env.REDIS_HOST

  connectStore = require('connect-redis')(session)
  sessionStore = new connectStore
    host: process.env.REDIS_HOST
    port: process.env.REDIS_PORT

  store = derby.createStore
    db: liveDbMongo process.env.MONGO_URL + '?auto_reconnect', {safe: true}
    redis: redisClient

  <% } else { %>
  connectStore = require('connect-mongo')(session)
  sessionStore = new connectStore url: process.env.MONGO_URL

  store = derby.createStore db: liveDbMongo(process.env.MONGO_URL + '?auto_reconnect', {safe: true})
  <% } %>

  derby.use racerBundle

  publicDir = path.join __dirname, '/../public'
  <% if (coffee) { %>
  store.on 'bundle', (browserify) ->

    browserify.transform {global: true}, coffeeify

    pack = browserify.pack
    browserify.pack = (opts) ->
      detectTransform = opts.globalTransform.shift()
      opts.globalTransform.push detectTransform
      pack.apply this, arguments

  <% } %>
  expressApp = module.exports = express()
    .use compression()
    .use serveStatic(publicDir)
    .use racerBrowserChannel(store)
    .use store.modelMiddleware()
    .use cookieParser()
    .use session
      secret: process.env.SESSION_SECRET
      store: sessionStore
      cookie: process.env.SESSION_COOKIE
    .use createUserId
    .use app.router()
    .all '*', (req, res, next) ->
      next('404: ' + req.url)
    .use error

  app.writeScripts store, publicDir, {<% if (coffee) { %>extensions: ['.coffee']<% } %>}, (err) ->
    cb and cb(err, expressApp)

