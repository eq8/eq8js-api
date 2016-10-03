'use strict';

var test = require('tape');
var Api = require('../index.js');

test('register() an action and state() it', function(t) {
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
