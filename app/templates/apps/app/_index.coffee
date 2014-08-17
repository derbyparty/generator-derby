derby = require 'derby'

app = module.exports = derby.createApp '<%= app %>', __filename

global.app = app unless derby.util.isProduction
<% if (bootstrap) { %>
app.use require 'd-bootstrap'<% } %><% if (login) { %>
app.use require 'derby-login/components'<% } %><% if (jade) { %>
app.serverUse module, 'derby-jade'<% } %><% if (stylus) { %>
app.serverUse module, 'derby-stylus'<% } %><% if (md) { %>
app.serverUse module, 'derby-markdown'<% } %>

app.loadViews __dirname + '/views'
app.loadStyles __dirname + '/styles'

app.get '/', (page) ->
  page.render 'home'