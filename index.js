var Transform = require('stream').Transform,
    util = require('util'),
    tea = require('./lib/TEA');
    bops = require('bops');

function Encrypt (key, opts) {
  this.key = key;
  Transform.call(this, opts);
}
util.inherits(Encrypt, Transform);
exports.Encrypt = Encrypt;

Encrypt.prototype._write = function(chunk, encoding, callback) {
  var out = EncryptBlock(chunk, this.key);
  this.push(out);
  callback();
}


function EncryptBlock(str, key) {
  return tea.encrypt(str, key);
}



function Decrypt(key, opts) {
  this.key = key;
  Transform.call(this, opts);
}

util.inherits(Decrypt, Transform);
exports.Decrypt = Decrypt;

Decrypt.prototype._write = function(chunk, encoding, callback) {
  var out = DecryptBlock(chunk, this.key);
  this.push(out);
  callback();
}


function DecryptBlock(str, key) {
  return tea.decrypt(str, key);
}

