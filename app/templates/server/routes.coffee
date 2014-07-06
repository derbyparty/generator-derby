express = require 'express'

router = express.Router()

router.post '/api/v1/item', (req, res) ->
  model = req.getModel()

  #...

  res.json true

module.exports = router