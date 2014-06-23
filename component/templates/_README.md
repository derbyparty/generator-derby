# d-<%= _.slugify(name) %>

A [Derby](http://github.com/codeparty/derby) component built in
vanilla JS (with no [d3](https://github.com/mbostock/d3)) to illustrate
differences in component coding styles.

## see also:  
[d-barchart](http://github.com/codeparty/d-barchart)
[d-d3-barchart](http://github.com/codeparty/d-d3-barchart)
[d-barchart-vanilla](http://github.com/codeparty/d-barchart-vanilla)

# Usage
[Example usage](http://github.com/codeparty/derby-examples/charts)

## In your template
```<% if(jade){ %>jade
view(name="d-<%= _.slugify(name) %>" data="{{_page.data}}" width="300" height="200")
<% } else { %>html
<view name="d-<%= _.slugify(name) %>" data={{_page.data}} width=300 height=200></view>
<% } %>```

### Optional arguments
```<% if(jade){ %>jade
view(name="d-<%= _.slugify(name) %>" data="{{_page.data}}" margins="{{_page.margins}}")
<% } else { %>html
<view name="d-<%= _.slugify(name) %>" data={{_page.data}} margins={{_page.margins}}></view>
<% } %>```

## Your data
```<% if(coffee){ %>coffeescript
model.set "_page.data",
  [
    {value: 1}
    {value: 10}
  ]
<% } else { %>javascript
model.set("_page.data", [ { value: 1 }, { value: 10 } ]);
<% } %>```

### Optional data
```<% if(coffee){ %>coffeescript
model.set "_page.margins",
  top: 0
  right: 20
  bottom: 0
  left: 20
<% } else { %>javascript
model.set("_page.margins", {top: 0, right: 20, bottom: 0, left: 20 });
<% } %>```

## Implementation pattern

In this example we take advantage of Derby's bindings to associate our data
with the DOM.

We use the __layout__ pattern where we transform input data into layout data, 
and then render the layout data.

We don't use any d3 to both show a more bare-bones Derby example, as well as 
show what d3 makes more convenient regarding laying out data.