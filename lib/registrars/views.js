/*
 * eq8-api
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

module.exports = function exported(_, async, Joi) {
	return function registerViews(views, done /* , prior */) {
		var api = this;

		var schema = Joi
			.array()
			.items(
				Joi.object({
					name: Joi.string().required(),
					pattern: Joi.object({
						uri: Joi.string().required()
					}).required(),
					handler: Joi.func().minArity(2).maxArity(3)
				})
			);
		var validate = Joi.validate.bind(Joi, views, schema, {convert: false});
		var addView = _addView.bind(null, api, _);
		var addViews = _addViews.bind(null, async, addView);

		async.waterfall([
			validate,
			addViews
		], done);

	};

};

function _addView(api, _, view, done) {
	var pattern = _.defaults({}, view.pattern);

	api.views.add(pattern, view.handler);

	return done();
}

function _addViews(async, addView, views, done) {
	async.each(views, addView, done);
}
