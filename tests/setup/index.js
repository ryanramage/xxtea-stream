var mkdirp = require('mkdirp'),
    rimraf =  require('rimraf');

exports.setup = function(dir) {
  mkdirp.sync(dir);
}


exports.teardown = function(dir) {
  rimraf.sync(dir);
}