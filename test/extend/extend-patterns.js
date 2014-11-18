/**
 * test Constructor.extend() calls
 */

var test = require('tape');
var Constructor = require('../../');

// fixture setup - this is the part about TAPE that needs help - the before/after stuff

var fixtures = {};

fixtures.A = Constructor({
  constructor: function A(name) {
      this.getName = function getName() {
          return name;
      };
  },
  test: function test() {
      return this.getName();
  }
});

test('A should just work', function (t) {
   
    var name = 'test name';
    var a = new fixtures.A(name);
    
    t.strictEquals(a.test(), name);
    t.end();
});


// inherit from A - pass in a constructor function only.

fixtures.B = Constructor(function B(name, value) {

  fixtures.A.call(this, name);

  this.getValue = function getValue() {
      return value;
  };
}, fixtures.A);

// add method to prototype after the extend() call to show the prototype can still be extended

fixtures.B.prototype.test = function test() {
  return this.getValue() + ":" + fixtures.A.prototype.test.call(this);
};
  
  
test('function B extends function A', function (t) {

  var name = 'test name';
  var value = 'test value';
  var b = new fixtures.B(name, value);
  
  t.strictEquals(b.test(), b.getValue() + ':' + b.getName());
  t.end();
});


// C is a prototype rather than a function

fixtures.C = {
  constructor: function C(name, value) {
    fixtures.B.call(this, name, value);
  },
  test: function test() {
    return this.getName() + ":" + this.getValue() + " >> " + fixtures.B.prototype.test.call(this);
  }
};

test('prototype C extends function B', function (t) {

  var name = 'test name';
  var value = 'test value';
  Constructor(fixtures.C, fixtures.B);
  
  var c = new fixtures.C.constructor(name, value);
  
  t.strictEquals(c.test(), name + ':' + value + " >> " + value + ':' + name);
  t.end();
});


// D is a prototype   

fixtures.D = {
  constructor: function D(name, value, prop) {
    
    fixtures.C.constructor.call(this, name, value);
      
    this.getProp = function getProp() {
      return prop;
    };
  },
  test: function test() {
    return this.getProp() + " >> " + fixtures.C.constructor.prototype.test.call(this);
  }
};

test('prototype D extends function C', function (t) {
  
  var name = 'test name';
  var value = 'test value';
  var prop = 'test prop';
   
  Constructor(fixtures.D, fixtures.C.constructor);
  
  var d = new fixtures.D.constructor(name, value, prop);
  
  t.strictEquals(d.test(), prop + " >> " + name + ':' + value + " >> " + value + ':' + name);

  t.end();
});

test('verify prototype chain D to A', function (t) {
   
  var name = 'test name';
  var value = 'test value';
  var prop = 'test prop';
  
  var A = fixtures.A;
  var B = fixtures.B;
  var C = fixtures.C.constructor;
  var D = fixtures.D.constructor;
  
  var d = new D(name, value, prop);
  
  t.strictEquals(d instanceof A, true);
  t.strictEquals(d instanceof B, true);
  t.strictEquals(d instanceof C, true);  
  t.strictEquals(d instanceof D, true);
  t.end();
});
