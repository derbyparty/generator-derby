// Config
var defaults = require('../config/defaults');

for(var key in defaults) {
  process.env[key] = process.env[key] || defaults[key];
}