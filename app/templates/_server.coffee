async = require 'async'
derby = require 'derby'

http  = require 'http'
chalk = require 'chalk'

publicDir = process.cwd() + '/public'

derby.run () ->
  require './server/config'

  apps = [
    require './apps/<%= app %>'
  ]

  express = require './server/express'
  store = require('./server/store')(derby)

  error = require './server/error'

  {expressApp, upgrade} = express store, apps, error

  server = http.createServer expressApp

  server.on 'upgrade', upgrade

  async.each apps, (app, cb) ->
    app.writeScripts store, publicDir, extensions: ['.coffee'], () ->
      console.log 'Bundle created:', chalk.yellow app.name
      cb()
  , () ->
    server.listen process.env.PORT, () ->
      console.log '%d listening. Go to: http://localhost:%d/',
        process.pid, process.env.PORT