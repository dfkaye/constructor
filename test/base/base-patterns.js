/**
 * test basic Constructor() calls
 */

var test = require('tape');
var Constructor = require('../../');

// test base function

function Base() {}

test('should return same function when sourse is a function', function (t) {

  t.strictEqual(Constructor(Base), Base);
  t.end();
});

test('should return empty constructor', function (t) {

  t.strictEqual(typeof Constructor({}), 'function');
  t.end();
});

test('should return Base as constructor', function (t) {

  t.strictEqual(Constructor({
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
  var A = Constructor({
    constructor: Base,
    test: function () {
        return msg;
    }
  });
  
  var a = new A();
  
  t.strictEqual(a.test(), msg);
  t.end();
});
