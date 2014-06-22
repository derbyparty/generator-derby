derby = require 'derby'
http  = require 'http'
defaults = require './config/defaults'

for key, value of defaults
  process.env[key] ?= value

listenCallback = (err) ->
  console.log '%d listening. Go to: http://localhost:%d/', process.pid, process.env.PORT

createServer = () ->
  server = require './server/index'

  server (err, expressApp) ->
    if err then throw err
    http.createServer(expressApp).listen process.env.PORT, listenCallback

derby.run createServer

