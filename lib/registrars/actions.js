/*
 * eq8-api
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

module.exports = function exported(_, async, Joi, Rx) {
	return function registerActions(actions, done /* , prior */) {
		var api = this;

		var actionSchema = Joi.object({
			name: Joi.string().required(),
			pattern: Joi.object().required(),
			handler: Joi.func().arity(2)
		});

		Rx.Observable
			.from(actions)
			.concatMap(function(action) {
				return Rx.Observable
					.fromNodeCallback(Joi.validate)(action, actionSchema, {convert: false});
			})
			.subscribe(
				function(action) {
					var pattern = _.defaults({}, action.pattern);

					api.actions.add(pattern, action.handler);
				},
				function(err) {
					api.logger.error(err);
				},
				function() {
					done();
				}
			);
	};
};
