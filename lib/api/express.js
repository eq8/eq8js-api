/*
 * eq8-api
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

module.exports = function exported(_) {
	return function express(context, pattern, done) {
		var api = this;
		var handler = api.views.lookup(pattern);
		var callback = done ? done : _.noop;

		if (handler && _.isFunction(handler)) {
			return handler.call(api, context, pattern, callback);
		}

		return null;
	};
};
