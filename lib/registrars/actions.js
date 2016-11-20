/*
 * eq8-api
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

module.exports = function exported(_, Joi, Rx) {
	return function registerActions(actions, callback /* , prior */) {
		var api = this;

		var actionSchema = Joi.object().keys({
			id: Joi.string(),
			name: Joi.string().required(),
			pattern: Joi.object().required(),
			handler: Joi.func().minArity(2).maxArity(3)
		});

		var done = _.once(callback);

		Rx.Observable
			.from(actions)
			.concatMap(function(action) {
				return Rx.Observable
					.fromNodeCallback(Joi.validate)(action, actionSchema, {convert: false});
			})
			.subscribe(
				function(action) {
					var pattern = _.defaults({}, action.pattern);

					var handler = action.handler;

					if (action.handler.length < 3) {
						handler = addCallback(handler);
					}

					if (action.id) {
						api.deregister('actions', action.id);

						api.registry.actions[action.id] = {
							pattern: pattern,
							handler: handler
						};
					}
					api.actions.add(pattern, handler);

				},
				function(err) {
					api.logger.error(err);
					done(err);
				},
				function() {
					done();
				}
			);
	};
};

function addCallback(handler) {
	return function newHandler(ctxt, action, done) {
		var api = this;

		setImmediate(handler.bind(api, ctxt, action));
		setImmediate(done);
	};
}
