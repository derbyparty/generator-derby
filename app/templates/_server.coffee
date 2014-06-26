derby = require 'derby'
http  = require 'http'
defaults = require './config/defaults'

for key, value of defaults
  process.env[key] ?= value

listenCallback = (err) ->
  console.log '%d listening. Go to: http://localhost:%d/',
    process.pid, process.env.PORT

createServer = () ->
  expressApp = require './server/index'

  http.createServer(expressApp).listen process.env.PORT, listenCallback

derby.run createServer
