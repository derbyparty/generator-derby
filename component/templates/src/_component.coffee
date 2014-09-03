module.exports = <%= className %>

class <%= className %>

  view:  __dirname<% if (!standalone) { %> + '/<%= component %>'<% } %>
  style: __dirname<% if (!standalone) { %> + '/<%= component %>'<% } %>
  name: '<%= component %>'

  init: ->

  create: ->

  destroy: ->
