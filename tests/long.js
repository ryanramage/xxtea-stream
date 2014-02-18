var xxtea = require('../'),
    test = require('tape'),
    fs = require('fs'),
    bops = require('bops'),
    concat = require('concat-stream'),
    streamEqual = require('stream-equal'),
    setup = require('./setup/'),
    dir = './tmp/long/';

setup.setup(dir);

test('large data to have multiple pipe calls', function(t){

  t.plan(1);

  fs.createReadStream("./tests/assets/long.txt")
    .pipe(new xxtea.Encrypt('8339d93jdooe2dwd'))
    .pipe(fs.createWriteStream(dir + 'long.txt.tea'))
    .on('close', decrypt);

  function decrypt(){
    console.log('begin decrypt');
    fs.createReadStream(dir + "long.txt.tea")
      .pipe(new xxtea.Decrypt('8339d93jdooe2dwd'))
      .pipe(fs.createWriteStream(dir + 'long.txt'))
      .on('close', function(){
        var readStream1 = fs.createReadStream("./tests/assets/long.txt");
        var readStream2 = fs.createReadStream(dir + 'long.txt');
        streamEqual(readStream1, readStream2, function(err, equal) {
          t.ok(equal)
          setup.teardown(dir);
        });

      })
  }
})
