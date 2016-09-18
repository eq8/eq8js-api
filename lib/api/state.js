/*
 * eq8-api
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

module.exports = function exported(_, async) {
	return function state(context, pattern) {
		var api = this;
		var handlers = api.actions.list(pattern);
		var callHandler = _callHandler.bind(
			api,
			context, pattern
		);

		async.each(handlers, callHandler);
	};
};

function _callHandler(context, pattern, handler) {
	var api = this;

	handler.call(api, context, pattern);
}
