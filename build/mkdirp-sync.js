#!/usr/bin/env node
;(function() {
  'use strict';

  /** Load Node.js modules */
  var fs = require('fs'),
      path = require('path');

  /** Add `path.sep` for older versions of Node.js */
  path.sep || (path.sep = process.platform == 'win32' ? '\\' : '/');

  /*--------------------------------------------------------------------------*/

  /**
   * Makes the given `path` directory, without throwing errors for existing
   * directories and making parent directories as needed.
   *
   * @param {String} dirname The path of the directory.
   * @param {Number|String} mode The permission mode.
   */
  function mkdirpSync(dirname, mode) {
    var sep = path.sep,
        type = typeof mode;

    // ensure relative paths are prefixed with `./`
    if (!RegExp('^\\.?' + sep).test(dirname)) {
      dirname = '.' + sep + dirname;
    }
    if (!(type == 'number' || type == 'string')) {
      mode = '0777';
    }
    dirname.split(sep).reduce(function(currPath, segment, index) {
      // skip leading separator of absolute paths
      if (index === 0 && currPath === '') {
        return sep;
      }
      segment = currPath + (currPath === sep ? segment : sep + segment);
      try {
        segment = fs.realpathSync(segment);
      } catch(e) {
        fs.mkdirSync(segment, mode);
      }
      return segment;
    });
  }

  /*--------------------------------------------------------------------------*/

  // expose
  module.exports = mkdirpSync;
}());
