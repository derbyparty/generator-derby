var derby = require('derby');

var app = module.exports = derby.createApp('<%= _.slugify(appname) %>', __filename);

app.use(require('derby-debug'));

app.loadViews(__dirname);

app.get('/', function(page, model) {
  page.render();
});