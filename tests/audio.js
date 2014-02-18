var xxtea = require('../'),
    test = require('tape'),
    fs = require('fs'),
    bops = require('bops'),
    concat = require('concat-stream'),
    streamEqual = require('stream-equal'),
    setup = require('./setup/'),
    dir = './tmp/audio/';

setup.setup(dir);

test('image audio encryption', function(t){

  t.plan(2);

  fs.createReadStream("./tests/assets/Miaow-07-Bubble.m4a")
    .pipe(new xxtea.Encrypt('8339d93jdooe2dwd'))
    .pipe(fs.createWriteStream(dir + 'Miaow-07-Bubble.m4a.tea'))
    .on('close', decrypt);

  function decrypt(){
    fs.createReadStream(dir + "Miaow-07-Bubble.m4a.tea")
      .pipe(new xxtea.Decrypt('8339d93jdooe2dwd'))
      .pipe(fs.createWriteStream(dir + 'Miaow-07-Bubble.m4a'))
      .on('close', function(){
        t.ok(true);
        var readStream1 = fs.createReadStream("./tests/assets/Miaow-07-Bubble.m4a");
        var readStream2 = fs.createReadStream(dir + 'Miaow-07-Bubble.m4a');
        streamEqual(readStream1, readStream2, function(err, equal) {
          t.ok(equal)
        });
      })
  }
})
