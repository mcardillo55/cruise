var express = require('express');
var router = express.Router();
const Presentation = require('../models/presentation')

/* GET home page. */
router.get('/presentations', function(req, res, next) {
  Presentation.findAll({
    attributes: ["id", "title", "presenter"]
})
.then((rows) => {
    res.send(rows)
  })
});

module.exports = router;
