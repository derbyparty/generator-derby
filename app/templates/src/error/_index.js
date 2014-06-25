var derby = require('derby');

var errorApp = module.exports = derby.createApp();
<% if (jade) { %>
errorApp.serverUse(module,'derby-jade');<% } %><% if (stylus) { %>
errorApp.serverUse(module, 'derby-stylus');<% } %>

errorApp.loadViews(__dirname + '/../../views/error');
errorApp.loadStyles(__dirname + '/../../styles/error/index');
errorApp.loadStyles(__dirname + '/../../styles/error/reset');