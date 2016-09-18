/*
 * eq8-api
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

module.exports = function exported(_, async, Joi) {
	return function registerActions(actions, done /* , prior */) {
		var api = this;

		var schema = Joi
			.array()
			.items(
				Joi.object({
					name: Joi.string().required(),
					pattern: Joi.object().required(),
					handler: Joi.func().arity(2)
				})
			);
		var validate = Joi.validate.bind(Joi, actions, schema, {convert: false});
		var addAction = _addAction.bind(null, api, _);
		var addActions = _addActions.bind(null, async, addAction);

		async.waterfall([
			validate,
			addActions
		], done);

	};

};

function _addAction(api, _, action, done) {
	var pattern = _.defaults({}, action.pattern);

	api.actions.add(pattern, action.handler);

	return done();
}

function _addActions(async, addAction, actions, done) {
	async.each(actions, addAction, done);
}
