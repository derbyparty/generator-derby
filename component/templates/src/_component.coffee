path = require "path"

module.exports = class <%= className %>
  view: path.join __dirname, "<%= component %>"
  style: path.join __dirname, "<%= component %>"

  init: (model) ->

  create: (model, dom) ->
