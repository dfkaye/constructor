/**
 * test basic Constructor() calls
 */

var test = require('tape');
var Constructor = require('../../src/Constructor.js').Constructor;

// test base function

function Base() {};

test('should return same function without new keyword', function (t) {

  t.strictEqual(Constructor(Base), Base);
  t.end();
});

test('should return same function using new keyword', function (t) {

  t.strictEqual(new Constructor(Base), Base);
  t.end();
});

test('should return empty constructor', function (t) {

  t.strictEqual(typeof new Constructor({}), 'function');
  t.end();
});

test('should return Base as constructor', function (t) {

  t.strictEqual(new Constructor({
        constructor: Base
    }), Base);
  
  t.end();
});


test('reuse constructor', function (t) {

  var A = Constructor({
    constructor: Base
  });
  
  t.strictEqual(Constructor(A), Base);
  t.end();
});

test('reuse constructor test() method', function (t) {

  var msg = 'test string';
  var A = new Constructor({
    constructor: Base,
    test: function () {
        return msg;
    }
  });
  
  var a = new A();
  
  t.strictEqual(a.test(), msg);
  t.end();
});
