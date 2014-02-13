var xxtea = require('../'),
    test = require('tape'),
    fs = require('fs'),
    bops = require('bops');
var concat = require('concat-stream');



test('image streaming encryption', function(t){


  fs.createReadStream("./tests/assets/tape_drive.png")
    .pipe(new xxtea.Encrypt(bops.from('8339d93jdooe2dwd', 'utf8')))
    .pipe(fs.createWriteStream('tape_drive.png.tea'))
    .on('close', decrypt);

  function decrypt(){
    fs.createReadStream("./tape_drive.png.tea")
      .pipe(new xxtea.Decrypt(bops.from('8339d93jdooe2dwd', 'utf8')))
      .pipe(fs.createWriteStream('tape_drive.png'))
  }
})
