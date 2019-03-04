var express = require('express');
var router = express.Router();
const Presentation = require('../models/presentation')
const Survey = require('../models/survey')
const sequelize = require('sequelize')

/* GET home page. */
router.get('/presentations', function(req, res, next) {
  Presentation.findAll({
    attributes: ["id", "title", "presenter"],
    order: [[sequelize.fn('lower', sequelize.col('title')), 'ASC']]
  })
  .then((rows) => {
    res.send(rows)
  })
  .catch((error) => {
    res.send([])
  })
});

router.post('/presentations', function(req, res, next) {
  Survey.create(req.body)
  res.send(req.body)
});

module.exports = router;
