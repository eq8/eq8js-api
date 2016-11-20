/*
 * eq8-api
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

module.exports = function exported() {
	return function deregister(type, id) {
		var api = this;
		var registry = api.registry[type];
		if (registry && registry[id]) {
			api[type].remove(registry[id].pattern, registry[id].handler);
			delete registry[id];
		}
	};
};
