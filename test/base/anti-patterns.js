/**
 * test basic Constructor() calls with primitves - should fail
 * 
 * these patterns constitute the case for the extend() method
 *
 */

var test = require('tape');
var Constructor = require('../../Constructor.js').Constructor;

// test base function

function Base() {};

test('should fail when argument not specified', function (t) {

  var A;

  try {
    A = new Constructor();
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
  
  t.end();
});

test('should fail when argument is boolean', function (t) {

  var A;

  try {
    A = new Constructor(true);
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
  
  t.end();
});

test('should fail when argument is number', function (t) {

  var A;

  try {
    A = new Constructor(457);
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
  
  t.end();
});

test('should fail when argument is string', function (t) {

  var A;

  try {
    A = new Constructor('string');
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
  
  t.end();
});

test('should wipeout A.prototype.test() method with reuse call', function (t) {

  var msg = 'test string';
  var A = new Constructor({
    constructor: Base,
    test: function () {
        return msg;
    }
  });
  
  var B = new Constructor({
    constructor: A
  });
  
  var a = new A();
  try {
    t.strictEqual(a.test(), msg);
    t.fail('should fail - test() should have been removed from A');
  } catch (e) {
    t.strictEqual(typeof a.test, 'undefined');
  }
  
  t.end();
});
