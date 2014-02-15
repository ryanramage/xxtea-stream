var Transform = require('stream').Transform,
    chunks = require('chunk-stream'),
    util = require('util'),
    tea = require('./lib/TEA');


function EncryptSetup(key, opts, cb) {
  if (key.length !== 16) throw new Error('Key must be 16 bytes');
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  if (!opts) opts = {};
  if (!cb) cb = function() {}

  var through = chunks(512);
  return through.pipe(new Encrypt(key, opts, cb))
}

exports.Encrypt = EncryptSetup;


function Encrypt (key, opts, cb) {
  this.key = key;
  this.on('finish', function(){
    cb();
  })
  Transform.call(this, opts);
}
util.inherits(Encrypt, Transform);


Encrypt.prototype._write = function(chunk, encoding, callback) {
  var out = tea.encrypt(chunk, this.key);
  this.push(out);
  callback();
}

function DecryptSetup(key, opts, cb) {
  if (key.length !== 16) throw new Error('Key must be 16 bytes');
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  if (!opts) opts = {};
  if (!cb) cb = function() {}

  var through = chunks(512);
  return through.pipe(new Decrypt(key, opts, cb))
}

exports.Decrypt = DecryptSetup;

function Decrypt(key, opts, cb) {
  this.key = key;
  this.on('finish', function(){
    cb();
  })
  Transform.call(this, opts);
}

util.inherits(Decrypt, Transform);

Decrypt.prototype._write = function(chunk, encoding, callback) {
  var out = tea.decrypt(chunk, this.key);
  this.push(out);
  callback();
}



