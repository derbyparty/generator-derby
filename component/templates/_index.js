<% if(coffee){ %>
require("coffee-script/register");
module.exports = require("./src/<%= component %>");
<% }else{ %>
module.exports = require("./lib/<%= component %>"); 
<% } %>
