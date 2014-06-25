# <%= pkgName %>

A [Derby](http://github.com/codeparty/derby) component.

## see also:
- [Official Components Guide](https://github.com/codeparty/derby/blob/master/docs/guides/components.md)
- [d-barchart](http://github.com/codeparty/d-barchart)
- [d-d3-barchart](http://github.com/codeparty/d-d3-barchart)
- [d-barchart-vanilla](http://github.com/codeparty/d-barchart-vanilla)

# Usage

## In your app
```javascript
// Use component published as module
app.component(require('<%= pkgName %>'));
```

## In your template
```<% if(jade){ %>jade
view(name="<%= component %>")
<% } else { %>html
<view name="<%= component %>"></view>
<% } %>```
