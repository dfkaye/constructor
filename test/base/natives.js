/**
 * test Constructor with natives
 */

var test = require('tape');
var Constructor = require('../../src/Constructor.js').Constructor;

test('ok when argument is array object', function (t) {
  t.plan(1);
  t.strictEqual(typeof Constructor([]), 'function');
});

test('ok when argument is Array constructor', function (t) {
  t.plan(1);
  t.strictEqual(typeof Constructor(Array), 'function');
});

test('should fail when argument is Date() string', function (t) {
  t.plan(1);
  var A;

  try {
    A = Constructor(Date());
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
});

test('ok when argument is Date object', function (t) {
  t.plan(1);
  t.strictEqual(typeof Constructor(new Date()), 'function');
});

test('ok when argument is Date constructor', function (t) {
  t.plan(1);
  t.strictEqual(typeof Constructor(Date), 'function');
});

test('ok when argument is String object', function (t) {
  t.plan(1);
  t.strictEqual(typeof Constructor(new String()), 'function');
});

test('should fail when argument is String() string', function (t) {
  t.plan(1);
  var A;

  try {
    A = Constructor(String());
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
});

test('ok when argument is String constructor', function (t) {
  t.plan(1);
  t.strictEqual(typeof Constructor(String), 'function');
});

test('ok when argument is RegExp() regex', function (t) {
  t.plan(1);
  t.strictEqual(typeof Constructor(RegExp()), 'function');
});

test('ok when argument is RegExp object', function (t) {
  t.plan(1);
  t.strictEqual(typeof Constructor(/^empty/), 'function');
});

test('ok when argument is RegExp constructor', function (t) {
  t.plan(1);
  t.strictEqual(typeof Constructor(RegExp), 'function');
});

test('should fail when argument is Number() number', function (t) {
  t.plan(1);
  var A;

  try {
    A = Constructor(Number(13));
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
});

test('ok when argument is Number object', function (t) {
  t.plan(1);
  t.strictEqual(typeof Constructor(new Number()), 'function');
});

test('ok when argument is Number constructor', function (t) {
  t.plan(1);
  t.strictEqual(typeof Constructor(Number), 'function');
});

test('should fail when argument is Boolean() boolean', function (t) {
  t.plan(1);
  var A;

  try {
    A = Constructor(Boolean(true));
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
});

test('ok when argument is Boolean object', function (t) {
  t.plan(1);
  t.strictEqual(typeof Constructor(new Boolean()), 'function');
});

test('ok when argument is Boolean constructor', function (t) {
  t.plan(1);
  t.strictEqual(typeof Constructor(Boolean), 'function');
});


test('*** how about Math? ***', function (t) {
  t.plan(1);
  t.strictEqual(typeof Constructor(Math), 'function');
});

