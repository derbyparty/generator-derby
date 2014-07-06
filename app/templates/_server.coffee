derby = require 'derby'
http  = require 'http'
express = require './server/express'

chalk = require 'chalk'

apps = [
  require './src/app'
]

error = require './server/error'
publicDir = process.cwd() + '/public'

defaults = require './config/defaults'

for key, value of defaults
  process.env[key] ?= value

derby.run () ->
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
