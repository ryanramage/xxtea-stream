var through = require('through'),
    bops = require('bops'),
    util = require('util'),
    tea = require('./lib/TEA');


function Encrypt(key, cb) {
  if (!bops.is(key)) {
    key = bops.from(key, 'utf8')
  }
  if (key.length !== 16) throw new Error('Key must be 16 bytes');
  this.key = key;
  if (!cb) cb = function() {}


  var chunk = new Buffer(0),
      self = this,
      chunkSize = 3200;

  var write = function (data) {
    // Ensure that it's a Buffer
    if (!Buffer.isBuffer(data)) {
      data = new Buffer(data)
    }
    var remainingSize = chunkSize - chunk.length
    chunk = Buffer.concat([chunk, data.slice(0, remainingSize)])
    data = data.slice(remainingSize)

    if (chunk.length === chunkSize) {
      self.handle_chunk(chunk, this)

      // Create as many full buffers of `chunkSize` as possible from `data`
      while (data.length > chunkSize) {
        self.handle_chunk(data.slice(0, chunkSize), this)
        data = data.slice(chunkSize)
      }

      // Whatever data remains, set the chunk to that so the next `data` event
      // or `end` event can queue it along
      chunk = data
    }
  }
  var end = function (data) {
    self.handle_chunk(chunk, this);
    this.queue(null);
  }
  return through(write, end)
}

Encrypt.prototype.handle_chunk = function(chunk, thr) {
  var out = tea.encrypt(chunk, this.key);
  thr.queue(out)
}

exports.Encrypt = Encrypt;


function Decrypt(key, cb) {
  if (!bops.is(key)) {
    key = bops.from(key, 'utf8')
  }
  if (key.length !== 16) throw new Error('Key must be 16 bytes');
  this.key = key;
  if (!cb) cb = function() {}

  var chunk = new Buffer(0),
      self = this,
      chunkSize = 3200;

  var write = function (data) {
    // Ensure that it's a Buffer
    if (!Buffer.isBuffer(data)) {
      data = new Buffer(data)
    }
    var remainingSize = chunkSize - chunk.length
    chunk = Buffer.concat([chunk, data.slice(0, remainingSize)])
    data = data.slice(remainingSize)

    if (chunk.length === chunkSize) {
      self.handle_chunk(chunk, this)

      // Create as many full buffers of `chunkSize` as possible from `data`
      while (data.length > chunkSize) {
        self.handle_chunk(data.slice(0, chunkSize), this)
        data = data.slice(chunkSize)
      }

      // Whatever data remains, set the chunk to that so the next `data` event
      // or `end` event can queue it along
      chunk = data
    }
  }
  var end = function (data) {
    self.handle_chunk(chunk, this, true);
    this.queue(null);
  }
  return through(write, end)
}


Decrypt.prototype.handle_chunk = function(chunk, thr, truncate) {
  var out = tea.decrypt(chunk, this.key, truncate);
  thr.queue(out);
}

exports.Decrypt = Decrypt;



