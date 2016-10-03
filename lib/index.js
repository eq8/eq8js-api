/*
 * eq8-api
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

// externals
var _ = require('lodash');
var async = require('async');
var bloomrun = require('bloomrun');
var util = require('util');

var Core = require('eq8-core');
var Joi = require('joi');
var Rx = require('rx');

function Api(options) {
	var api = this;

	var actions = bloomrun();
	var views = bloomrun({indexing: 'depth'});

	options = _.defaultsDeep(options, {
		registrars: {
			actions: require('./registrars/actions')(_, Joi, Rx),
			views: require('./registrars/views')(_, Joi, Rx)
		}
	});

	// INITIALIZATION
	_.assign(api, {
		actions: actions,
		views: views
	});

	Core.call(api, options);
}
util.inherits(Api, Core);

// API

Api.prototype.state = require('./api/state')(_, async);
Api.prototype.express = require('./api/express')(_);

function newApi(options) {
	return new Api(options);
}

module.exports = newApi;
