var xxtea = require('../'),
    fs = require('fs'),
    bops = require('bops');
var concat = require('concat-stream');

fs.createReadStream("./tests/assets/secret.txt")
  .pipe(new xxtea.Encrypt('8339d93jdooe2dwd', 'utf8'))
  .pipe(fs.createWriteStream('out.text.tea'))
  .on('end', decrypt);

setTimeout(decrypt, 2000);

function decrypt(){
  console.log('about to decryt');
  fs.createReadStream("./out.text.tea")
    .pipe(new xxtea.Decrypt('8339d93jdooe2dwd', 'utf8'))
    .pipe(concat(function(contents) {
      console.log(contents.toString('utf-8'));
      // contents is the contents of the entire file
    }))

}





