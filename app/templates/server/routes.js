var express = require('express');

var router = express.Router();

router.post('/api/v1/item', function(req, res){
  var model = req.getModel();
  //...
  res.json(true);
});

module.exports = router;