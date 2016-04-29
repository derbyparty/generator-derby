derby = require 'derby'

errorApp = module.exports = derby.createApp 'error', __filename
<% if (jade) { %>
errorApp.serverUse module, 'derby-jade'<% } %><% if (stylus) { %>
errorApp.serverUse module, 'derby-stylus'<% } %>

errorApp.loadViews __dirname + '/views'
errorApp.loadStyles __dirname + '/styles/index'
errorApp.loadStyles __dirname + '/styles/reset'
