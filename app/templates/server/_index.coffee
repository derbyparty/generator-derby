express = require 'express'

session = require 'express-session'
serveStatic = require 'serve-static'
compression = require 'compression'
cookieParser = require 'cookie-parser'

derby = require 'derby'

app = require '../src/app'

coffeeify = require 'coffeeify'

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

mongoUrl = process.env.MONGO_URL

connectStore = require('connect-mongo')(session)
sessionStore = new connectStore url: mongoUrl
<% if (redis) { %>
redisClient = require('redis').createClient()
redisClient.select process.env.REDIS_DB

store = derby.createStore
  db: liveDbMongo mongoUrl + '?auto_reconnect', {safe: true}
  redis: redisClient
<% } else { %>
store = derby.createStore db: liveDbMongo(mongoUrl + '?auto_reconnect', {
  safe: true})
<% } %>

derby.use racerBundle

publicDir = process.cwd() + '/public'
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

app.writeScripts store, publicDir, {<% if (coffee) { %>
  extensions: ['.coffee']
<% } %>}, ->

