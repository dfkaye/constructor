/**
 * test Constructor.extend() calls - should fail
 *
 */

var test = require('tape');
var Constructor = require('../../src/Constructor.js').Constructor;

// test base function

function Base() {};

test('should fail when second argument not specified', function (t) {
  t.plan(1);
  var A;

  try {
    A = Constructor.extend(Base);
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
});

test('should fail when second argument is boolean', function (t) {
  t.plan(1);
  var A;

  try {
    A = Constructor.extend(Base, true);
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
});

test('should fail when second argument is number', function (t) {
  t.plan(1);
  var A;

  try {
    A = Constructor.extend(Base, 457);
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
});

test('should fail when second argument is string', function (t) {
  t.plan(1);
  var A;

  try {
    A = Constructor.extend(Base, 'string');
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
});

test('extend() should complain about identical Base constructors', function (t) {
  t.plan(1);
  
  var A = Constructor({
    constructor: Base
  });
  
  var B;
  
  try {
      B = Constructor.extend(A, {
        constructor: Base
      });
      
      t.fail('should fail - extend() should complain about identical Base constructors');
      
  } catch (e) {
    t.strictEqual(typeof B, 'undefined');
  }
});

test('extend() should complain about identical constructors with reused subclass', function (t) {
  t.plan(1);
  
  var A = Constructor({
    constructor: Base
  });
  
  var B;
  
  try {
      B = Constructor.extend(A, {
        constructor: A
      });
      
      t.fail('should fail - extend() should complain about identical reused subclass');
      
  } catch (e) {
    t.strictEqual(typeof B, 'undefined');
  }
});

/* template */
/*
test('$1 should return $2', function (t) {
  t.plan(1);
  t.fail('next test to implement');
});
*/