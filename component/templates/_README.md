# <%= component %>

A [Derby](http://github.com/codeparty/derby) component.

# Usage

## In your app
```javascript
// Use component published as module
app.component(require('<%= component %>'));
```

## In your template
```<% if(jade){ %>jade
view(name="<%= component %>")
<% } else { %>html
<view name="<%= component %>"></view>
<% } %>```

## see also:
- [Official Components Guide](https://github.com/codeparty/derby/blob/master/docs/guides/components.md)
- [Derby 0.6: Introduction to components](https://github.com/dmapper/derby-tutorials/blob/master/derby4.md)
- [d-barchart](http://github.com/codeparty/d-barchart)
- [d-d3-barchart](http://github.com/codeparty/d-d3-barchart)
- [d-barchart-vanilla](http://github.com/codeparty/d-barchart-vanilla)