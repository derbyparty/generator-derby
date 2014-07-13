express = require 'express'

expressSession = require 'express-session'
serveStatic = require 'serve-static'
compression = require 'compression'
cookieParser = require 'cookie-parser'
bodyParser = require 'body-parser'
highway = require 'racer-highway'<% if (login) { %>
derbyLogin = require 'derby-login'<% } %>
<% if (!login) { %>
createUserId = (req, res, next) ->
  model = req.getModel()
  userId = req.session.userId
  if not userId
    userId = req.session.userId = model.id()
  model.set '_session.userId', userId
  next()<% } %>

module.exports = (store, apps, error) ->

  connectStore = require('connect-mongo')(expressSession)
  sessionStore = new connectStore url: process.env.MONGO_URL

  session = expressSession
    secret: process.env.SESSION_SECRET
    store: sessionStore
    cookie: process.env.SESSION_COOKIE
    saveUninitialized: true
    resave: true


  handlers = highway store, session: session

  expressApp = express()
    .use compression()
    .use serveStatic process.cwd() + '/public'
    .use store.modelMiddleware()
    .use cookieParser()
    .use bodyParser.json()
    .use bodyParser.urlencoded extended: true
    .use session<% if (login) { %>
    .use derbyLogin.middleware store, require '../config/login'<% } %>
    .use handlers.middleware<% if (!login) { %>
    .use createUserId<% } %>

  apps.forEach (app) -> expressApp.use app.router()

  expressApp.use require './routes'

  expressApp
    .all '*', (req, res, next) -> next '404: ' + req.url
    .use error

  {expressApp:expressApp, upgrade:handlers.upgrade}

