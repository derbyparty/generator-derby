derby = require 'derby'

derby.run () ->
  http  = require 'http'
  chalk = require 'chalk'

  publicDir = process.cwd() + '/public'

  apps = [
    require './apps/<%= app %>'
  ]

  express = require './server/express'
  error = require './server/error'

  # Config
  defaults = require './config/defaults'

  for key, value of defaults
    process.env[key] ?= value

  store = require('./server/store')(derby)
  {expressApp, upgrade} = express store, apps, error

  server = http.createServer expressApp

  server.on 'upgrade', upgrade

  server.listen process.env.PORT, () ->
    console.log '%d listening. Go to: http://localhost:%d/',
      process.pid, process.env.PORT

  apps.forEach (app) ->
    app.writeScripts store, publicDir, extensions: ['.coffee'], () ->
      console.log 'Bundle created:', chalk.yellow app.name
