async = require 'async'
derby = require 'derby'

http  = require 'http'
chalk = require 'chalk'

publicDir = process.cwd() + '/public'

derby.run () -><% if (yamlify) { %>
  require 'yamlify/register'<% } %>
  require './server/config'

  apps = [
    require './apps/<%= app %>'
    # <end of app list> - don't remove this comment
  ]

  express = require './server/express'
  store = require('./server/store')(derby, publicDir)

  error = require './server/error'

  {expressApp, upgrade} = express store, apps, error, publicDir

  server = http.createServer expressApp

  server.on 'upgrade', upgrade

  async.each apps, (app, cb) ->
    app.writeScripts store, publicDir, extensions: ['.coffee'], () ->
      console.log 'Bundle created:', chalk.blue app.name
      cb()
  , () ->
    server.listen process.env.PORT, () ->
      console.log '%d listening. Go to: http://localhost:%d/',
        process.pid, process.env.PORT