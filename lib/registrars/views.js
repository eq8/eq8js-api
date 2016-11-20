/*
 * eq8-api
 * Copyright(c) 2016 Benjamin Bartolome
 * Apache 2.0  Licensed
 */

'use strict';

module.exports = function exported(_, Joi, Rx) {
	return function registerViews(views, callback /* , prior */) {
		var api = this;

		var viewSchema = Joi.object().keys({
			id: Joi.string(),
			name: Joi.string().required(),
			pattern: Joi.object(),
			handler: Joi.func().minArity(2).maxArity(3)
		});

		var done = _.once(callback);

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

					if (view.id) {
						api.deregister('views', view.id);

						api.registry.views[view.id] = {
							pattern: pattern,
							handler: view.handler
						};
					}

					api.views.add(pattern, view.handler);
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
