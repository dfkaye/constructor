/**
 * test Constructor with native object instances
 *
 * WARNING - passing in a Native constructor is actually an ANTI-PATTERN
 */

var test = require('tape');
var Constructor = require('../../');

test('ok when argument is array object', function (t) {

  t.strictEqual(typeof Constructor([]), 'function');
  t.end();
});

test('should fail when argument is Date() string', function (t) {

  var A;

  try {
    A = Constructor(Date());
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
  
  t.end();
});

test('ok when argument is Date object', function (t) {

  t.strictEqual(typeof Constructor(new Date()), 'function');
  t.end();
});

test('ok when argument is String object', function (t) {

  t.strictEqual(typeof Constructor(new String()), 'function');
  t.end();
});

test('should fail when argument is String() string', function (t) {

  var A;

  try {
    A = Constructor(String());
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
  
  t.end();
});

test('ok when argument is RegExp() regex', function (t) {

  t.strictEqual(typeof Constructor(RegExp()), 'function');
  t.end();
});

test('ok when argument is RegExp object', function (t) {

  t.strictEqual(typeof Constructor(/^empty/), 'function');
  t.end();
});

test('should fail when argument is Number() number', function (t) {

  var A;

  try {
    A = Constructor(Number(13));
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
  t.end();
});

test('ok when argument is Number object', function (t) {

  t.strictEqual(typeof Constructor(new Number()), 'function');
  t.end();
});

test('should fail when argument is Boolean() boolean', function (t) {

  var A;

  try {
    A = Constructor(Boolean(true));
    t.fail('should have failed');
  } catch(e) {
    t.strictEqual(typeof A, 'undefined');
  }
  
  t.end();
});

test('ok when argument is Boolean object', function (t) {

  t.strictEqual(typeof Constructor(new Boolean()), 'function');
  t.end();
});

test('*** how about Math? ***', function (t) {

  t.strictEqual(typeof Constructor(Math), 'function');
  t.end();
});


/* use the native Constructors */

test('ok when argument is Array constructor', function (t) {

  var A = Constructor(Array);
  
  t.strictEqual(typeof A.prototype.push, 'function');
  t.end();
});

test('ok when argument is Date constructor', function (t) {

  var D = Constructor(Date);
  
  t.strictEqual(typeof D.prototype.getTime, 'function');
  t.end();
});

test('ok when argument is String constructor', function (t) {

  var S = Constructor(String);
  
  t.strictEqual(typeof S.prototype.indexOf, 'function');
  t.end();
});

test('ok when argument is RegExp constructor', function (t) {

  var R = Constructor(RegExp);
  
  t.strictEqual(typeof R.prototype.exec, 'function');
  t.end();
});

test('ok when argument is Number constructor', function (t) {

  var N = Constructor(Number);
  
  t.strictEqual(typeof N.prototype.toPrecision, 'function');
  t.end();
});

test('ok when argument is Boolean constructor', function (t) {

  /* Boolean prototype doesn't have enough interesting method names beyond Object.prototype */
  function nonce() {};
  Boolean.prototype.nonce = nonce;
  
  var B = Constructor(Boolean);
  t.strictEqual(B.prototype.nonce, nonce);
  
  // clean up *sigh*
  Boolean.prototype.nonce = null;
  
  t.end();
});
