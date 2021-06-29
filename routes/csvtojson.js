var express = require('express');
var router = express.Router();
const csv = require('csv-parser');
const streamifier = require('streamifier');
const fs = require('fs')
const results = [];
const multer = require('multer');
const upload = multer({
  fileFilter: (req, file, cb) => {

    const filetypes = /csv/;
    const extname = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Error: CSV Files Only!');
    }
  }, 
  filename: function (req, file, cb) { 
     cb(null , Date.now()+file.originalname);   
  }
}).single("uploadedcsv");

/* GET users listing. */
router.post('/upload', function(req, res, next) {
  upload(req, res, (err) => {
    if(err) {
      res.status(400).send(err);
    }
      // var enc = new TextDecoder("utf-8");
      // var arr = new Uint8Array(req.file.buffer);
      // var result = enc.decode(arr);
      // var parsed = csv(result);
  
      streamifier.createReadStream(req.file.buffer)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(results);
        fs.writeFile('./test1.txt', JSON.stringify(results, null, 4), err => {
          if (err) {
            console.error(err)
            return
          }
          //file written successfully
        })
        // [
        //   { NAME: 'Daffy Duck', AGE: '24' },
        //   { NAME: 'Bugs Bunny', AGE: '22' }
        // ]
      });
      // console.log(parsed);
      res.send(req.file);   
  });
});

module.exports = router;
