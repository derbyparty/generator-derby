module.exports = class <%= name %>
  view = __dirname
  style = __dirname

  init = =>
    @model.setNull key, value for key, value in
      data: []
      width: 200
      height: 100
      layout: []
    @transform()

  create = =>  
    # changes in values inside the array
    @model.on "all", "data**", =>
      @transform()

  transform = =>
    data = @model.get("data") or []
    width = @model.get "width"
    height = @model.get "height"
    yMax = 0
    
    data.forEach (d) -> yMax = d.value if d.value > yMax
  
    barWidth = width / data.length
    
    yScale = (v) -> v * height / yMax
  
    # update the layout
    layout = data.map (d, i) ->
      x: i * barWidth
      y: height - yScale d.value
      width: barWidth / 2
      height: yScale d.value
    
    # we do more computing in js (setDiffDeep) to avoid extra re-rendering
    @model.setDiffDeep "layout", layout

  clicker = (d, i, evt, el) ->
    console.log "clicked!", d, i, el
