var Readable = require('stream').Readable,
    Transform = require('stream').Transform,
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
  //var from_str = bops.to(chunk, 'utf-8');
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
  //var from_str = bops.to(chunk, 'utf-8');
  var out = DecryptBlock(chunk, this.key);
  this.push(out);
  callback();
}


function DecryptBlock(str, key) {
  return tea.decrypt(str, key);
}



// ported from http://www.movable-type.co.uk/scripts/tea-block.html

// function EncryptBlock(from_buffer, key_buff) {
//   if (from_buffer.length == 0) return('');  // nothing to encrypt

//   var out = bops.create(from_buffer.length * 4);

//   // convert string to array of longs after converting any multi-byte chars to UTF-8
//   var v = from_buffer;

//   // simply convert first 16 chars of password as key
//   var k = key_buff;
//   var n = length(v);

//   // ---- <TEA coding> ----

//   var z = get(v, n-1), y = get(v,0), delta = 0x9E3779B9;
//   var mx, e, q = Math.floor(6 + 52/n), sum = 0;

//   while (q-- > 0) {  // 6 + 52/n operations gives between 6 & 32 mixes on each word
//       sum += delta;
//       e = sum>>>2 & 3;
//       for (var p = 0; p < n; p++) {
//           y = get(v, (p+1)%n);
//           mx = (z>>>5 ^ y<<2) + (y>>>3 ^ z<<4) ^ (sum^y) + (get(k,p&3 ^ e) ^ z);
//           console.log('mx', mx);
//           z = get(v,p) + mx;
//           console.log('z', z);
//           write(out, p, z);
//       }
//   }
//   return out;
//     // ---- </TEA> ----
// }


// function length(buf) {
//   return buf.length / 4;
// }

// // note little-endian encoding - endianness is irrelevant as long as
// // it is the same in write()

// // returns 32 bit unsinged (a long)
// function get(buf, at) {
//   console.log('get', at *4 , buf.length);
//   var a =  bops.readInt32BE(buf, at*4 )
//   console.log(a);
//   return a;
// }

// function write(buf, at, value){
//   console.log('write',value);
//   return bops.writeInt32BE(buf, value, at * 4);
// }
