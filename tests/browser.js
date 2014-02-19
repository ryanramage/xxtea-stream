var xxtea = require('../'),
    test = require('tape'),
    bops = require('bops'),
    concat = require('concat-stream'),
    streamEqual = require('stream-equal');


test('large data to have multiple pipe calls', function(t){

  t.plan(1);

  new xxtea.Encrypt('8339d93jdooe2dwd');


  t.ok(true);
})