/**
 * test Constructor.extend() calls - should fail
 *
 */

var test = require('tape');
var Constructor = require('../../constructor.js').Constructor;

// test base function

function Base() {};

test('should fail when second argument not specified', function (t) {

  var A;

  try {
    A = Constructor.extend(Base);
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
  
  t.end();
});

test('should fail when second argument is boolean', function (t) {

  var A;

  try {
    A = Constructor.extend(Base, true);
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
  
  t.end();
});

test('should fail when second argument is number', function (t) {

  var A;

  try {
    A = Constructor.extend(Base, 457);
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
  
  t.end();
});

test('should fail when second argument is string', function (t) {

  var A;

  try {
    A = Constructor.extend(Base, 'string');
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
  
  t.end();
});

test('extend() should complain about identical Base constructors', function (t) {

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
  
  t.end();
});

test('extend() should complain about identical constructors with reused subclass', function (t) {

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
  
  t.end();
});

test('should fail to inherit instance closure when __super__() not called from constructor', function (t) {

  var closure_msg = "closure_msg";
  var A = {
    constructor: function () {
      this.test = function () {
        return closure_msg;
      }    
    }   
  };
  
  var proto = {
    // constructor: function () { this.__super__(); }
    log: function () {
        return this.test();
    }
  };
  
  var B = Constructor.extend(A, proto);
  var b = new B;
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
