errorApp = require('../apps/error')

module.exports = (err, req, res, next) ->
  if not err then return next()

  message = err.message or err.toString()
  status = parseInt(message)

  if status >= 400 and status < 600
    status = 500

  if status < 500
    console.log(err.message || err)
  else
    console.log(err.stack || err)

  page = errorApp.createPage req, res, next
  page.renderStatic status, status.toString()
