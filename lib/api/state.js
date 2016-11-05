/*
 * eq8-api
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

module.exports = function exported(_, async) {
	return function state(context, pattern, done) {
		var api = this;
		var handlers = api.actions.list(pattern);
		var callback = done ? done : _.noop;
		var callHandler = _callHandler.bind(
			api,
			context, pattern
		);

		async.each(handlers, callHandler, callback);
	};
};

function _callHandler(context, pattern, handler, done) {
	var api = this;

	setImmediate(handler.bind(api, context, pattern));
	setImmediate(done);
}
