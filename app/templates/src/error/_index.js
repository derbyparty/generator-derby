var derby = require('derby');

var errorApp = module.exports = derby.createApp();
<% if (includeJade) { %>
errorApp.serverUse(module,'derby-jade');<% } %><% if (includeStylus) { %>
errorApp.serverUse(module, 'derby-stylus');<% } %>

errorApp.loadViews(__dirname + '/../../views/error');
errorApp.loadStyles(__dirname + '/../../styles/error/index');
errorApp.loadStyles(__dirname + '/../../styles/error/reset');