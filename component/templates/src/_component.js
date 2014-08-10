module.exports = <%= className %>;

function <%= className %>(){}

<%= className %>.prototype.view = __dirname<% if (!standalone) { %> + '/<%= component %>'<% } %>;
<%= className %>.prototype.style =__dirname<% if (!standalone) { %> + '/<%= component %>'<% } %>;
<%= className %>.prototype.name = '<%= component %>';

<%= className %>.prototype.init = function(){

};

<%= className %>.prototype.create = function(){

};