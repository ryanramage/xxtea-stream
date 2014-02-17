var xxtea = require('../'),
    test = require('tape'),
    fs = require('fs'),
    bops = require('bops'),
    concat = require('concat-stream'),
    setup = require('./setup/'),
    dir = './tmp/basic/';

setup.setup(dir);

test('symetric streaming encryption', function(t){

  t.plan(1);

  fs.createReadStream("./tests/assets/secret.txt")
    .pipe(new xxtea.Encrypt('8339d93jdooe2dwd'))
    .pipe(fs.createWriteStream(dir + 'out.text.tea'))
    .on('close', decrypt);

  function decrypt(){
    fs.createReadStream(dir + "out.text.tea")
      .pipe(new xxtea.Decrypt('8339d93jdooe2dwd'))
      .pipe(concat(function(contents) {
        t.equal(contents.toString('utf-8'), 'Something secret should not be seen. Very amaze.!');
        setup.teardown(dir);
      }))
  }
})


