/**
 * test Constructor.extend() calls - should fail
 *
 */

var test = require('tape');
var Constructor = require('../../');

// test base function

function Base() {}

test('should fail when second argument is boolean', function (t) {

  var A;

  try {
    A = Constructor(true, Base);
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
  
  t.end();
});

test('should fail when second argument is number', function (t) {

  var A;

  try {
    A = Constructor(457, Base);
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
  
  t.end();
});

test('should fail when second argument is string', function (t) {

  var A;

  try {
    A = Constructor('string', Base);
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
  
  t.end();
});

test('extend() should complain about identical constructors with reused subclass', function (t) {

  var A = Constructor({
    constructor: Base
  });
  
  var B;
  
  try {
      B = Constructor({
        constructor: A
      }, A);
      
      t.fail('should fail - should complain about identical reused subclass');
      
  } catch (e) {
    t.strictEqual(typeof B, 'undefined');
  }
  
  t.end();
});

test('should fail to inherit instance closure when super constructor not called from constructor', function (t) {

  var closure_msg = "closure_msg";
  var A = {
    constructor: function () {
      this.test = function () {
        return closure_msg;
      };
    }   
  };
  
  var proto = {
    // constructor: function () { this.__super__(); }
    log: function () {
      return this.test();
    }
  };
  
  var B = Constructor(proto, A);
  var b = new B();
  var msg;

  try {
    msg = b.log();
    t.fail('should fail with missing method error');
  } catch (e) {
    t.strictEqual(typeof msg, 'undefined', 'msg should be undefined');
  }
  
  t.end();
});

/*test('extending native Array should fail to inherit generic methods', function (t) {

  var proto = {
    constructor: function () { this.__super__(); },
    log: function () {
        return this.toString();
    }
  };
  
  var B = Constructor.extend(Array, proto);
  var b = new B;
  var msg;
  
  try {
    msg = b.log();
    t.fail('should have thrown generic toString error');
  } catch (e) {
    t.strictEqual(typeof msg, 'undefined');
  }
  
  t.end();
});*/
