/**
 * test basic Constructor() calls
 */

var test = require('tape');
var Constructor = require('../../src/Constructor.js').Constructor;

// test base function

function Base() {};

test('should return same function without new keyword', function (t) {
  t.plan(1);
  t.strictEqual(Constructor(Base), Base);
});

test('should return same function using new keyword', function (t) {
  t.plan(1);
  t.strictEqual(new Constructor(Base), Base);
});

test('should return empty constructor', function (t) {
  t.plan(1);
  t.strictEqual(typeof new Constructor({}), 'function');
});

test('should return Base as constructor', function (t) {
  t.plan(1);
  t.strictEqual(new Constructor({
        constructor: Base
    }), Base);
});


test('reuse constructor', function (t) {
  t.plan(1);
  var A = Constructor({
    constructor: Base
  });
  
  t.strictEqual(Constructor(A), Base);
});

test('reuse constructor test() method', function (t) {
  t.plan(1);
  var msg = 'test string';
  var A = new Constructor({
    constructor: Base,
    test: function () {
        return msg;
    }
  });
  
  var a = new A();
  t.strictEqual(a.test(), msg);
});
