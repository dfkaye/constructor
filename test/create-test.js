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

/* template */
/*
test('$1 should return $2', function (t) {
  t.plan(1);
  t.fail('next test to implement');
});
*/