/**
 * test Constructor.extend() calls
 */

var test = require('tape');
var Constructor = require('../../src/Constructor.js').Constructor;

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

fixtures.B = Constructor.extend(fixtures.A, function B(name, value) {

  this.parent(name);

  this.getValue = function getValue() {
      return value;
  };
});

// add method to prototype after the extend() call to show the prototype can still be extended

fixtures.B.prototype.test = function test() {
  return this.getValue() + ":" + this.parent.test();
};
  
  
test('function B extends function A', function (t) {

  var name = 'test name';
  var value = 'test value';
  var b = new fixtures.B(name, value);
  
  t.strictEquals(b.test(), b.getValue() + ':' + b.getName());
  t.end();
});

test('parent methods are public', function (t) {

  var name = 'test name';
  var value = 'test value';
  var b = new fixtures.B(name, value);
  
  t.strictEquals(b.parent.getName(), b.getName());
  t.end();
});


// C is a prototype rather than a function

fixtures.C = {
  	constructor: function C(name, value) {
  		this.parent(name, value);
  	},
  	test: function test() {
  		return this.getName() + ":" + this.getValue() + " >> " + this.parent.test();
  	}
  };

test('prototype C extends function B', function (t) {

  var name = 'test name';
  var value = 'test value';
  
  Constructor.extend(fixtures.B, fixtures.C);
  
  var c = new fixtures.C.constructor(name, value);
  
  t.strictEquals(c.test(), name + ':' + value + " >> " + value + ':' + name);
  t.end();
});


// D is a prototype 

fixtures.D = {
  constructor: function D(name, value, prop) {
  	
    this.parent(name, value);
  		
  	this.getProp = function getProp() {
  	  return prop;
    }
  },
  test: function test() {
  	return this.getProp() + " >> " + this.parent.test();
  }
};

test('prototype D extends function C', function (t) {
  
  var name = 'test name';
  var value = 'test value';
  var prop = 'test prop';
   
  Constructor.extend(fixtures.C.constructor, fixtures.D);
  
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
