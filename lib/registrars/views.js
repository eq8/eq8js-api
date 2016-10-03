/*
 * eq8-api
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

module.exports = function exported(_, async, Joi, Rx) {
	return function registerViews(views, done /* , prior */) {
		var api = this;

		var viewSchema = Joi.object().keys({
			name: Joi.string().required(),
			pattern: Joi.object(),
			handler: Joi.func().minArity(2).maxArity(3)
		});

		Rx.Observable
			.from(views)
			.concatMap(function(view) {
				return Rx.Observable
					.fromNodeCallback(Joi.validate)(view, viewSchema, {convert: false});
			})
			.filter(function(view) {
				return !!view.pattern.uri;
			})
			.subscribe(
				function(view) {
					var pattern = _.defaults({}, view.pattern);

					api.views.add(pattern, view.handler);
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
