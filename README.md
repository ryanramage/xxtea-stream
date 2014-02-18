xxtea-stream
============

A node/browserify streaming xxtea encryption and decryption module

[![Build Status](https://secure.travis-ci.org/ryanramage/xxtea-stream.png)](http://travis-ci.org/ryanramage/xxtea-stream)

I wanted to get my hands dirty with a simple encryption that would stream and work both node and browser side.
This is the result.

Ported from http://www.movable-type.co.uk/scripts/tea-block.html

Pros
----

 - Encrypted file size can be exactly the same as the original size
 - streaming allows for low memory footprint
 - decent speed
 - runs in pure node or on browser with browserify

Cons
----

This should be considered a weak crypto. From Wikipedia:

    XXTEA is vulnerable to a chosen-plaintext attack requiring 259 queries and negligible work.[1]


Install
-----

    npm install xxtea-stream


Usage
-----

    var xxtea = require('xxtea');
    var pipe = new xxtea.Encrypt('8339d93jdooe2dwd')
    var pipe = new xxtea.Decrypt('8339d93jdooe2dwd')

When creating an instance, you must tpass in a string of exactly 16 characters (bytes) as the
key. The key is symetric in that the same must be passed in the Encrypt and Decrypt function.



Encryption
----------

    var xxtea = require('xxtea');

    fs.createReadStream(".secret.txt")
      .pipe(new xxtea.Encrypt('8339d93jdooe2dwd')))
      .pipe(fs.createWriteStream('out.text.tea'))
      .on('close', decrypt);


Decryption
----------

    var xxtea = require('xxtea');
    var bops = require('bops')

    fs.createReadStream("./out.text.tea")
      .pipe(new xxtea.Decrypt(8339d93jdooe2dwd'))
      .pipe(concat(function(contents) {
        contents.toString('utf-8'); // shhh - dont tell!
      }))

In Browser
----------

    var drop = require('drag-and-drop-files');
    var createReadStream = require('filereader-stream');
    var xxtea = require('xxtea-stream');


    drop(document.body, function(files) {
      var first = files[0]
      createReadStream(first)
        .pipe(new xxtea.Decrypt("secret12secret12"))
        .pipe(concat(function(contents) {
            console.log(contents.toString('utf-8')); // shhh - dont tell!
        }))
    })


Decrypt an audio file and play it

    var oReq = new XMLHttpRequest();
    oReq.open("GET", "younger.mp3.tea", true);
    oReq.responseType = "blob";

    oReq.onload = function (oEvent) {

      createReadStream(oReq.response)
         .pipe(new tea.Decrypt(bops.from("secret12secret12")))
         .pipe(concat(function(contents) {
         var objectURL = window.URL.createObjectURL(new Blob([contents], {type: 'audio/mpeg'} ));
         new Audio(objectURL).play();
      }))
    };
    oReq.send(null);


