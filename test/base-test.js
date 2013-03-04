var test = require('tape');
var Constructor = require('../src/Constructor.js').Constructor;

// test base object
function Base() {};

test('should return function without new keyword', function (t) {
  t.plan(1);
  t.strictEqual(Constructor(Base), Base);
});

test('should return function using new keyword', function (t) {
  t.plan(1);
  t.strictEqual(new Constructor(Base), Base);
});

test('should return function', function (t) {
  t.plan(1);
  t.strictEqual(1, 0);
});

/* template */
/*
test('$1 should return $2', function (t) {
  t.plan(1);
  t.fail('next test to implement');
});
*/