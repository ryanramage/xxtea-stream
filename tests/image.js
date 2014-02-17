var xxtea = require('../'),
    test = require('tape'),
    fs = require('fs'),
    bops = require('bops'),
    concat = require('concat-stream'),
    streamEqual = require('stream-equal'),
    setup = require('./setup/'),
    dir = './tmp/image/';

setup.setup(dir);

test('image streaming encryption', function(t){

  t.plan(2);

  fs.createReadStream("./tests/assets/tape_drive.png")
    .pipe(new xxtea.Encrypt('8339d93jdooe2dwd'))
    .pipe(fs.createWriteStream(dir + 'tape_drive.png.tea'))
    .on('close', decrypt);

  function decrypt(){
    fs.createReadStream(dir + "tape_drive.png.tea")
      .pipe(new xxtea.Decrypt('8339d93jdooe2dwd'))
      .pipe(fs.createWriteStream(dir + 'tape_drive.png'))
      .on('close', function(){
        t.ok(true);
        var readStream1 = fs.createReadStream("./tests/assets/tape_drive.png");
        var readStream2 = fs.createReadStream(dir + 'tape_drive.png');
        streamEqual(readStream1, readStream2, function(err, equal) {
          t.ok(equal)
        });
      })
  }
})
