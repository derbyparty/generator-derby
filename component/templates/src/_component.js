var path = require("path");

module.exports = <%= className %>;

function <%= className %>() {};

<%= className %>.prototype.view = path.join(__dirname, "<%= component %>");
<%= className %>.prototype.style = path.join(__dirname, "<%= component %>");

<%= className %>.prototype.init = function(model){

};

<%= className %>.prototype.create = function(model, dom){

};