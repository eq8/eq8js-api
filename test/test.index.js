'use strict';

var _ = require('lodash');
var test = require('tape');
var Api = require('../index.js');

test('register() an action w/o callback and state() it', function(t) {
	var api = new Api();
	var testPattern = {
		ns: 'test',
		cmd: 'test',
		v: '0.1'
	};
	var testContext = 'some arbitrary context object';

	t.plan(3);
	api.register({actions: [
		{
			name: 'test action',
			pattern: testPattern,
			handler: function(context, args) {
				t.equal(context, testContext);
				t.equal(args, testPattern);
			}
		}
	]}, function(err) {
		t.ok(!err);

		api.state(testContext, testPattern);
	});
});

test('register() an action w/ callback and state() it', function(t) {
	var api = new Api();
	var testPattern = {
		ns: 'test',
		cmd: 'test',
		v: '0.1'
	};
	var testContext = 'some arbitrary context object';

	t.plan(4);
	api.register({actions: [
		{
			name: 'test action',
			pattern: testPattern,
			handler: function(context, args, done) {
				t.equal(context, testContext);
				t.equal(args, testPattern);
				done();
			}
		}
	]}, function(err) {
		t.ok(!err);

		api.state(testContext, testPattern, function() {
			t.pass();
		});
	});
});

test('register() an action and deregister() it', function(t) {
	var api = new Api();
	var testId = '1';
	var testPattern = {
		ns: 'test',
		cmd: 'test',
		v: '0.1'
	};
	var testContext = 'some arbitrary context object';

	t.plan(5);
	api.register({actions: [
		{
			id: testId,
			name: 'test action',
			pattern: testPattern,
			handler: function(context, args) {
				t.equal(context, testContext);
				t.equal(args, testPattern);
			}
		}
	]}, function(err) {
		t.ok(!err);

		t.equal(_.keys(api.registry.actions).length, 1);
		api.state(testContext, testPattern, function() {
			api.deregister('actions', testId);
			t.equal(_.keys(api.registry.actions).length, 0);
		});
	});
});

test('register() view w/o callback and express() it', function(t) {
	var api = new Api();
	var testPattern = {
		uri: '/some/arbitrary/path'
	};
	var testContext = {
		user: 'someArbitraryUser'
	};
	var testHandlerReturnValue = 'test-return-handler-value';

	t.plan(4);
	api.register({views: [
		{
			name: 'test action',
			pattern: testPattern,
			handler: function(context, pattern) {
				t.equal(context, testContext);
				t.equal(pattern, testPattern);
				return testHandlerReturnValue;
			}
		}
	]}, function(err) {
		t.ok(!err);

		var handlerReturnValue = api.express(testContext, testPattern);
		t.equal(handlerReturnValue, testHandlerReturnValue);
	});
});

test('register() view w/ callback and express() it', function(t) {
	var api = new Api();
	var testPattern = {
		uri: '/some/arbitrary/path'
	};
	var testContext = {
		user: 'someArbitraryUser'
	};

	t.plan(4);
	api.register({views: [
		{
			name: 'test action',
			pattern: testPattern,
			handler: function(context, pattern, done) {
				t.equal(context, testContext);
				t.equal(pattern, testPattern);
				done();
			}
		}
	]}, function(err) {
		t.ok(!err);

		api.express(testContext, testPattern, function() {
			t.pass('passed handler callback');
		});
	});
});

test('register() view and deregister() it', function(t) {
	var api = new Api();
	var testId = '1';
	var testPattern = {
		uri: '/some/arbitrary/path'
	};
	var testContext = {
		user: 'someArbitraryUser'
	};

	t.plan(5);
	api.register({views: [
		{
			id: testId,
			name: 'test action',
			pattern: testPattern,
			handler: function(context, pattern, done) {
				t.equal(context, testContext);
				t.equal(pattern, testPattern);
				done();
			}
		}
	]}, function(err) {
		t.ok(!err);

		t.equal(_.keys(api.registry.views).length, 1);
		api.express(testContext, testPattern, function() {
			api.deregister('views', testId);
			t.equal(_.keys(api.registry.views).length, 0);
		});
	});
});

test('register() actions and views with valid schema', function(t) {
	var api = new Api();

	t.plan(2);
	api.register({
		actions: [
			{
				name: 'Some Action',
				pattern: {
					ns: 'test'
				},
				handler: function(ctxt, action) {
					return !!action;
				}
			}
		]
	}, function(err) {
		t.ok(!err);
	});

	api.register({
		views: [
			{
				name: 'Some View with a handler arity of 2',
				pattern: {
					ns: 'test'
				},
				handler: function(ctxt, view) {
					return !!view;
				}
			},
			{
				name: 'Some View with a handler arity of 3',
				pattern: {
					ns: 'test'
				},
				handler: function(ctxt, view, done) {
					return !!done;
				}
			}
		]
	}, function(err) {
		t.ok(!err);
	});
});

test('register() actions and views with invalid schema', function(t) {
	var api = new Api();

	t.plan(2);
	api.register({
		actions: [
			{invalid: true}
		]
	}, function(err) {
		t.ok(err);
	});

	api.register({
		views: [
			{invalid: true}
		]
	}, function(err) {
		t.ok(err);
	});
});

test('express() a view that does not exist', function(t) {
	var api = new Api();

	t.plan(1);

	api.express(null, null);

	t.pass();
});
