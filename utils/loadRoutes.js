'use strict';

const fs = require('fs'), 
      path = require('path'), 
      colors = require('colors'),
      _ =  require('underscore');

module.exports = function(app, options) {
	var defaults = {
		dir: __dirname + '/../routes'
	};

	options = options || {};
	_.extend(defaults, options);

  fs
    .readdirSync(defaults.dir)
    .filter(function(file) {
      return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
    })
    .forEach(function(file) {
      var route = require(defaults.dir + '/' + file);
      console.log(`--Adding routes from: ${file} - ${file.slice(0, -3)}`.yellow )
      app.use(file === 'index.js' ? '/' : file.slice(0, -3), route);
    });
};