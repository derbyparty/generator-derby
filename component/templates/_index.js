<% if(coffee){ %>
require("coffee-script/register");
module.exports = require("./src/d-<%= _.slugify(name) %>");
<% }else{ %>
module.exports = require("./lib/d-<%= _.slugify(name) %>"); 
<% } %>
