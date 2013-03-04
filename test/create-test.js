var test = require('tape');
var Constructor = require('../src/Constructor.js').Constructor;

// test base function

function F() {};

test('should return same function without new keyword', function (t) {
  t.plan(1);
  t.strictEqual(Constructor(F), F);
});

test('should return same function using new keyword', function (t) {
  t.plan(1);
  t.strictEqual(new Constructor(F), F);
});

test('should return empty constructor', function (t) {
  t.plan(1);
  t.strictEqual(typeof new Constructor({}), 'function');
});

test('should return F as constructor', function (t) {
  t.plan(1);
  t.strictEqual(new Constructor({
        constructor: F
    }), F);
});

// bad arguments

test('should fail when argument not specified', function (t) {
  t.plan(1);
  var A;

  try {
    A = new Constructor();
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
});

test('should fail when argument is boolean', function (t) {
  t.plan(1);
  var A;

  try {
    A = new Constructor(true);
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
});

test('should fail when argument is number', function (t) {
  t.plan(1);
  var A;

  try {
    A = new Constructor(457);
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
});

test('should fail when argument is string', function (t) {
  t.plan(1);
  var A;

  try {
    A = new Constructor('string');
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
});

/* template */
/*
test('$1 should return $2', function (t) {
  t.plan(1);
  t.fail('next test to implement');
});
*/