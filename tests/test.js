var xxtea = require('../'),
    test = require('tape'),
    fs = require('fs'),
    bops = require('bops');
var concat = require('concat-stream');



test('symetric streaming encryption', function(t){

  t.plan(1);

  fs.createReadStream("./tests/assets/secret.txt")
    .pipe(new xxtea.Encrypt(bops.from('8339d93jdooe2dwd', 'utf8')))
    .pipe(fs.createWriteStream('out.text.tea'))
    .on('close', decrypt);

  function decrypt(){
    fs.createReadStream("./out.text.tea")
      .pipe(new xxtea.Decrypt(bops.from('8339d93jdooe2dwd', 'utf8')))
      .pipe(concat(function(contents) {
        t.equal(contents.toString('utf-8'), 'Something secret should not be seen. Very amaze.')
      }))
  }
})


