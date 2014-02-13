var bops = require('bops');

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Block TEA (xxtea) Tiny Encryption Algorithm implementation in JavaScript                      */
/*     (c) Chris Veness 2002-2012: www.movable-type.co.uk/tea-block.html                          */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Algorithm: David Wheeler & Roger Needham, Cambridge University Computer Lab                   */
/*             http://www.cl.cam.ac.uk/ftp/papers/djw-rmn/djw-rmn-tea.html (1994)                 */
/*             http://www.cl.cam.ac.uk/ftp/users/djw3/xtea.ps (1997)                              */
/*             http://www.cl.cam.ac.uk/ftp/users/djw3/xxtea.ps (1998)                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Tea = {};  // Tea namespace

/*
 * encrypt text using Corrected Block TEA (xxtea) algorithm
 *
 * @param {string} plaintext String to be encrypted (multi-byte safe)
 * @param {string} password  Password to be used for encryption (1st 16 chars)
 * @returns {string} encrypted text
 */
Tea.encrypt = function(plaintext, password) {
    if (plaintext.length == 0) return('');  // nothing to encrypt

    // convert string to array of longs after converting any multi-byte chars to UTF-8
    var v = Tea.bufferToLongs(plaintext);
    if (v.length <= 1) v[1] = 0;  // algorithm doesn't work for n<2 so fudge by adding a null
    // simply convert first 16 chars of password as key
    var k = Tea.bufferToLongs(password.slice(0,16));
    var n = v.length;

    // ---- <TEA coding> ----

    var z = v[n-1], y = v[0], delta = 0x9E3779B9;
    var mx, e, q = Math.floor(6 + 52/n), sum = 0;

    while (q-- > 0) {  // 6 + 52/n operations gives between 6 & 32 mixes on each word
        sum += delta;
        e = sum>>>2 & 3;
        for (var p = 0; p < n; p++) {
            y = v[(p+1)%n];
            mx = (z>>>5 ^ y<<2) + (y>>>3 ^ z<<4) ^ (sum^y) + (k[p&3 ^ e] ^ z);
            z = v[p] += mx;
        }
    }

    // ---- </TEA> ----

    var ciphertext = Tea.longToBuff(v);

    return ciphertext;
}

/*
 * decrypt text using Corrected Block TEA (xxtea) algorithm
 *
 * @param {string} ciphertext String to be decrypted
 * @param {string} password   Password to be used for decryption (1st 16 chars)
 * @returns {string} decrypted text
 */
Tea.decrypt = function(ciphertext, password) {
    if (ciphertext.length == 0) return('');
    var v = Tea.bufferToLongs(ciphertext);
    var k = Tea.bufferToLongs(password.slice(0,16));
    var n = v.length;

    // ---- <TEA decoding> ----

    var z = v[n-1], y = v[0], delta = 0x9E3779B9;
    var mx, e, q = Math.floor(6 + 52/n), sum = q*delta;

    while (sum != 0) {
        e = sum>>>2 & 3;
        for (var p = n-1; p >= 0; p--) {
            z = v[p>0 ? p-1 : n-1];
            mx = (z>>>5 ^ y<<2) + (y>>>3 ^ z<<4) ^ (sum^y) + (k[p&3 ^ e] ^ z);
            y = v[p] -= mx;
        }
        sum -= delta;
    }

    // ---- </TEA> ----

    var plaintext = Tea.longToBuff(v);

    // strip trailing null chars resulting from filling 4-char blocks:
    //plaintext = plaintext.replace(/\0+$/,'');

    return plaintext;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

// supporting functions

Tea.bufferToLongs = function(buff) {  // convert string to array of longs, each containing 4 chars
    // note chars must be within ISO-8859-1 (with Unicode code-point < 256) to fit 4/long
    var l = new Array(Math.ceil(buff.length/4));
    for (var i=0; i<l.length; i++) {

        var x = bops.readUInt8(buff, i*4);
        try {  x+= (bops.readUInt8(buff, i*4+1)<<8  ) } catch(ignore){}
        try {  x+= (bops.readUInt8(buff, i*4+2)<<16 ) } catch(ignore){}
        try {  x+= (bops.readUInt8(buff, i*4+3)<<24)  } catch(ignore){}

        l[i] = x;

    }

    return l;  // note running off the end of the string generates nulls since
}              // bitwise operators treat NaN as 0

Tea.longToBuff = function(l) {  // convert array of longs back to string
    var a = bops.create(l.length * 4);

    for (var i=0; i<l.length; i++) {
        var b1 = l[i]      & 0xFF;
        var b2 = l[i]>>>8  & 0xFF;
        var b3 = l[i]>>>16 & 0xFF;
        var b4 = l[i]>>>24 & 0xFF;


        bops.writeUInt8(a, b1, i*4);
        bops.writeUInt8(a, b2, i*4+1);
        bops.writeUInt8(a, b3, i*4+2);
        bops.writeUInt8(a, b4, i*4+3);
    }

    return a;  // use Array.join() rather than repeated string appends for efficiency in IE
}



/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

module.exports = Tea;
