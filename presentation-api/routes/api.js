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

router.post('/survey', function(req, res, next) {
  // Serialize the 'links' array to store as a space-separated string
  if(req.body.links){
    req.body.links = req.body.links.join(' ')
  }
  Survey.upsert(req.body)
  res.send(req.body)
});

// Responds with single survey entry if 'id' field is included,
// otherwise will return all submitted surveys in DB
router.get('/survey', function(req, res, next) {
  let options = { attributes: { exclude: ['createdAt', 'updatedAt'] } }
  if(req.query.id) {
    options = {...options, where: { presentationID: req.query.id } }
  }
  Survey.findAll(options)
  .then((row) => {
    res.send(row)
  })
  .catch((error) => {
    res.send([])
  })
})

module.exports = router;
