constructor.js
=====================

[![Build Status](https://travis-ci.org/dfkaye/constructor.png)](https://travis-ci.org/dfkaye/constructor)

constructor.js ~ constructor- and prototype- inheritance module. 

Motivation
----------

Though there are problems with inheritance (mainly overuse and coupling), it should just work and JavaScript should support it.  Yes, it already "does", but [see this proposal for a better api](https://gist.github.com/dfkaye/4948675 "constructor-api-proposal").

tape & testling
---------------

Using [tape](https://github.com/substack/tape) to run tests from the node.js command line, and in order to use [testling](http://ci.testling.com/) from the github service hook.

[![browser support](https://ci.testling.com/dfkaye/constructor.png)](https://ci.testling.com/dfkaye/constructor)

[Things I've found about checking things in for testling to work](https://gist.github.com/dfkaye/5225546)

use
---

  node:

    var Constructor = require('constructor');

  browser:

    <script src='path/to/constructor.js'></script>
    <script>
      var example = Constructor(etc);
    </script>

Constructor API
---------------

### Constructor(base) ###

specify a base object with 'constructor' defined as a function.  If constructor is not defined, an empty function is provided. The constructor function's prototype is then set to the base object, and the function is returned. If you pass in a function, that function is returned immediately without modification.
    
Example:
    
    Dialog = Constructor({
      constructor: function (contentNode) {
        this.contentNode = contentNode;
      },
      hide: function () {
        this.contentNode.hide();
      },
      reposition: function (left, top) {
        // do some repositioning
      },
      resize: function (width, height) {
        // do some resizing
      },
      show: function () {
        this.contentNode.show();
      }
    });
    
    // Use:
    
    var a = new Dialog({ id: 'superFunHappyMockContentNode'});
    
    
Prior Art
---------

This implementation is based on the type() method suggested by Nicholas Zakas in his post [Custom types (classes) using object literals in JavaScript](http://www.nczonline.net/blog/2011/11/04/custom-types-classes-using-object-literals-in-javascript/ "Custom types (classes) using object literals in JavaScript")
    
Zakas' method is in turn based on a de-sugaring of Jeremy Askenas' suggested api for the class, extend, super keyword proposals for ES6.


### Constructor(child, base) ###

Specify a base object or function to inherit from, and a child object or function that will inherit from the base. In the constructor, use it as a function call initially, then as an object thereafter.
    
An example - hastily presented:

    ConfigurableDialog = Constructor({
    
      constructor: function (contentNode, state) {
    
        Dialog.call(this, contentNode);
        
        this.state = state;
        
        if (this.state.displayOnCreate === true && !this.state.shown) {
            this.show();
        }
      },
      
      hide: function () {
        if (this.state.shown) {
        
          Dialog.prototype.hide.call(this);
          
          this.state.shown = false;
        }
      },
      
      show: function () {
        if (!this.state.shown) {
      
          Dialog.prototype.show.call(this);
          
          this.state.shown = true;
        }
      }
    }, Dialog);
    
    
Statics or Class-level properties
---------------------------------

Statics will be inherited, but not override.

By using `constructor.js`, you can access a staticName on a base constructor by specific name like: `<SuperName>.staticName`.

Example:
    
    Request = Constructor({
    
    });
    
    Request.staticMethod = function (obj) {
      // do something with obj
    };
    
    Post = Constructor({
      constructor: function () {
        //...
      },
      
accessing the method:

      accessStatic: function () {
        return this.constructor.staticMethod(xxx);
      },
      
applying the method to the current scope:

      applyStatic: function () {
        return Request.staticMethod.apply(this.constructor, xxx);
      }
      
    }, Request);
  
__UPDATE 27 MAR 2014__:  Blog Post on the [problem with static inheritance](http://dfkaye.github.io/2014/03/27/problem-with-static-inheritance-in-coffeescript/)

Tests
=====

* base case tests __done for now__
* extend case tests __done for now__
* anti-pattern tests, inherit-statics, using-natives __done for now__

The only failing tests are in extend/using-natives.js, and only in IE 6, 7, & 8. See the [Extending Natives?](#extending-natives) section further down.

The /base and /extend test cases show the intended usage of Constructor() and Constructor.extend().

The /base and /extend directories contain an ___anti-patterns.js___ test which shows a few clever and/or misguided uses that have surprising side-effects. 

Under /extend is the inherit-statics.js tests which show how to access a static attribute from a __super__ constructor, but goes into some detail about the example from which this test is derived.   The example is taken from [Programming in CoffeeScript](http://www.amazon.com/gp/product/032182010X/) by [Mark Bates](http://metabates.com/), Addison-Wesley, pp. 147-150, where the author shows that CoffeeScript does not support static inheritance through the `__super__` keyword. However, the example contains a more fundamental problem with respect to static property access that is NOT specific to CoffeeScript.  

__UPDATE 27 MAR 2014__:  Blog Post on this problem [fixing static inheritance](http://dfkaye.github.io/2014/03/27/problem-with-static-inheritance-in-coffeescript/)

test from node.js command line:
------------------------------

    cd ./constructor
  
    // run suite of all tests
    
    npm test
    
    // run individual base tests
    
    node test/base/anti-patterns.js
    node test/base/base-patterns.js
    node test/base/using-natives.js

    // run individual extend tests

    node test/extend/anti-patterns.js 
    node test/extend/extend-patterns.js
    node test/extend/using-natives.js
    node test/extend/inherit-statics.js 


browser test suite:
-------------------

Using [browserify](http://browserify.org) to bundle up the [tape](https://github.com/substack/tape) tests above.

    $ npm run bundle
    
  or
  
    $ browserify ./test/suite.js -o ./browser-test/bundle.js

The html suite uses a `dom-console.js` shim for reporting all of [tape](https://github.com/substack/tape)'s `console.log` statements into the DOM 
itself. This is located at <https://github.com/dfkaye/constructor/blob/master/browser-test/dom-console.js>
    
**You can view the browser-test/suite.html file on <a href='//rawgit.com/dfkaye/constructor/master/browser-test/suite.html' 
    target='_blank' title='opens in new tab or window'>rawgit</a>**


<a id="extending-natives"></a>

Extending Natives?
==================

YES, you can inherit from Native functions, but there are some caveats - see the [test/extend/using-natives.js](https://github.com/dfkaye/constructor/blob/master/test/extend/using-natives.js) file for a complete implementation of a SubArray that inherits from the native Array constructor.

And the caveats?  The use of the internal [[Class]] identifier in the JS engines differs between IE 6-8 and all the others (not surprisingly) - but all have a common restriction in that special methods based on the [[Class]] will fail on any objects not identified as constructed by that [[Class]].

### tl;dr ###

* subclassing Array requires overwriting `concat()` and `toString()` methods. 
* IE 6-8 iterations fail on `this.length` on subarray instances.  
* IE 6-7 don't allow subclasses to inherit any methods in this implementation of constructor inheritance.

npm
---

    npm install constructor
    
license
-------

    JSON