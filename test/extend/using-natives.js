/**
 * test Constructor.extend() with natives
 *
 * YES!  You can extend native constructors, provided you are aware of a couple things.
 * In this set of tests, we'll use extend to subclass the Array constructor and provide workarounds for
 * for constructor initialization and [[Class]] dependent methods (toString()).
 */

var test = require('tape');
var Constructor = require('../../src/Constructor.js').Constructor;

/*
 * FIXTURE - fairly complete example of extending the native built-in Arrays.
 *
 * NOTE:  the first argument here could also be just the Array constructor.
 */
var SubArray = Constructor.extend([], {
  constructor: function () {
    this.parent();
    
    // stolen from kangax (http://bit.ly/W66vQW)
    this.push.apply(this, arguments);
  },
  
  // borrowed from kangax (http://bit.ly/W66vQW)
  last: function () {
    return this[this.length - 1];
  },

  /**
   * @method toString - must be defined explicitly
   *
   * kangax (http://bit.ly/W66vQW), effective javascript (item 40, pp. 106ff), and some learning 
   * tests tell us that the Array.prototype.toString() method fails on objects whose constructor is
   * not really an Array - due to the internal use of [[Class]] by the JavaScript engine - so we'll 
   * have to shim it.
   */
  toString: function () {
    return this.join();
  }
});
  
test('SubArray - verify the toString() fix', function (t) {
  t.plan(1);

  var b = new SubArray('first', 'middle', 'last');

  t.strictEqual(b.toString(), 'first,middle,last');
});

test('SubArray - verify custom method - last', function (t) {
  t.plan(1);

  var b = new SubArray('first', 'middle', 'last');
  
  t.strictEqual(b.last(), 'last');
});

test('SubArray - index access', function (t) {
  t.plan(3);

  var b = new SubArray('first', 'middle', 'last');
  
  t.strictEqual(b[0], 'first');
  t.strictEqual(b[1], 'middle');
  t.strictEqual(b[2], 'last');
});

test('SubArray - length', function (t) {
  t.plan(1);

  var b = new SubArray('first', 'middle', 'last');

  t.strictEqual(b.length, 3);
});

test('SubArray - reverse', function (t) {
  t.plan(1);

  var b = new SubArray('first', 'middle', 'last');
  
  t.strictEqual(b.reverse().last(), 'first');
});

test('SubArray - sort', function (t) {
  t.plan(1);

  var b = new SubArray('first', 'middle', 'last');
  
  t.strictEqual(b.sort().last(), 'middle');
});

test('SubArray - shift', function (t) {
  t.plan(2);

  var b = new SubArray('first', 'middle', 'last');
  b.shift();
  
  t.strictEqual(b[0], 'middle');
  t.strictEqual(b.length, 2);
});

test('SubArray - pop', function (t) {
  t.plan(1);

  var b = new SubArray('first', 'middle', 'last');
  
  t.strictEqual(b.pop(), 'last');
});

test('SubArray - push', function (t) {
  t.plan(2);

  var b = new SubArray('first');
  b.push('last');
  
  t.strictEqual(b.last(), 'last');
  t.strictEqual(b.length, 2);
});

test('SubArray - splice', function (t) {
  t.plan(1);

  var b = new SubArray('first');
  b.splice(1, 1, 'last');
  
  t.strictEqual(b.last(), 'last');
});

test('SubArray - unshift', function (t) {
  t.plan(1);

  var b = new SubArray('first');
  b.unshift('last');
  
  t.strictEqual(b.last(), 'first');
});


/* template */
/*
test('$1 should return $2', function (t) {
  t.plan(1);
  t.fail('next test to implement');
});
*/
