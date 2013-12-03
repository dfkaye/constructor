Constructor.js
=====================

Constructor.js ~ constructor-, prototype- and __super__- inheritance module. 

Motivation
----------

Though there are problems with inheritance (mainly overuse and coupling), it 
should just work and JavaScript should support it.  Yes, it already "does" but 
[see this proposal for a better api](https://gist.github.com/dfkaye/4948675 "constructor-api-proposal").

tape & testling
---------------

Using [tape](https://github.com/substack/tape) to run tests from the node.js 
command line, and in order to use [testling](http://ci.testling.com/) from the
github service hook.

[![browser support](https://ci.testling.com/dfkaye/Constructor.png)](https://ci.testling.com/dfkaye/Constructor)

[Things I've found about checking things in for testling to work](https://gist.github.com/dfkaye/5225546)

use
---

node:

    var Constructor = require('./Constructor').Constructor;

browser:

    <script src='path/to/Constructor.js'></script>
    <script>
      var example = window.Constructor(etc);
    </script>


Constructor API
---------------

__Constructor(base)__ ~ specify a base object with 'constructor' defined as a 
    function.  If constructor is not defined, an empty function is provided.
    The constructor function's prototype is then set to the base object, and the
    function is returned.  If you pass in a function, that function is returned
    immediately withou modification.  Use of the 'new' keyword when calling 
    Constructor() is optional.
    
    Example:
    
    Dialog = new Constructor({
        constructor: function Dialog(contentNode) {
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
    
    Use:
    
    var a = new Dialog({ id: 'superFunHappyMockContentNode'});
    
    
__Prior Art__ 

This implementation is based on the type() method suggested byNicholas Zakas in 
his post [Custom types (classes) using object literals in JavaScript]
(http://www.nczonline.net/blog/2011/11/04/custom-types-classes-using-object-literals-in-javascript/ 
"Custom types (classes) using object literals in JavaScript")
    
Zakas' method is in turn based on a desugaring of Jeremy Askenas' suggested
api for the class, extend, super keyword proposals for ES6.
    
__Constructor.extend(base, child)__

Specify a base object or function to inherit from, and a child object or 
function that will inherit from the base.  The base is referenced from the child 
by __this.parent__.  In the constructor, use it as a function call initially, 
then as an object thereafter.
    
    Example - hastily presented:

    ConfigurableDialog = Constructor(Dialog, {
        constructor: function Dialog(contentNode, state) {
        
            this.__super__(contentNode); // first use of __super__
            
            this.state = state;
            
            if (this.state.displayOnCreate === true && !this.state.shown) {
                this.show();
            }
        },
        hide: function () {
            if (this.state.shown) {
            
                this.__super__.hide(); // __delegate to the parent__
                
                this.state.shown = false;
            }
        },
        show: function () {
            if (!this.state.shown) {
            
                this.__super__.show(); // delegate to the __super__
                
                this.state.shown = true;
            }
        }
    });
    
    
Statics or Class-level properties
---------------------------------

These are __not__ inherited by the Constructor.extend() operation as statics are 
defined on a constructor directly, not on its prototype (which provides a map 
for instances).  Inheriting statics is not regarded as a good practice anyway in
Java land.  

In the JavaScript world, using Constructor.js, you can still access such
properties by referring to the __super__.constructor (no call or apply necessary):

    Example
    
    Request = Constructor({
    
    });
    
    Request.staticMethod = function (obj) {
        // do something with obj
    };
    
    Post = Constructor.extend(Post, {
        constructor: function () {
            //...
        },
        accessParentStatic: function () {
            
            return this.__super__.constructor.staticMethod(this);  // <- this way
        }
    });
    

Tests
=====

* base case tests __done for now__
* extend case tests ___done for now___
* anti-pattern tests, inherit-statics, using-natives ___done for now___

The only failing tests are in extend/using-natives.js, and only in IE 6, 7, & 8.
See the [Extending Natives?](#extending-natives) section further down.

The /base and /extend test cases show the intended usage of Constructor() and 
Constructor.extend().

The /base and /extend directories contain an ___anti-patterns.js___ test which 
shows a few clever and/or misguided uses that have surprising side-effects. 

Under /extend is the inherit-statics.js tests which shows how to access a static 
attribute from a __super__ constructor, but goes into some detail about the example
from which this test is derived.   The example is taken from __Programming in 
CoffeeScript__ by Mark Bates, Addison-Wesley, pp. 147-150, where the author 
shows that CoffeeScript does not support static inheritance through the 
__super__ keyword.  However, the example contains a more fundamental problem NOT 
specific to CoffeeScript.

*There may be a rant about that example on my [gists](https://gist.github.com/dfkaye) eventually.*


test from node.js command line:
------------------------------

    cd ./Constructor
  
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

Using [browserify](http://browserify.org) to bundle up the 
[tape](https://github.com/substack/tape) tests above.

    $ browserify ./test/*.js -o ./browser-test/bundle.js

The suite uses a `dom-console.js` shim for reporting all of 
[tape](https://github.com/substack/tape)'s `console.log` statements into the DOM 
itself.
    
__You can view the browser-test/suite.html file on 
<a href='//rawgithub.com/dfkaye/Constructor/master/browser-test/suite.html' 
    target='_new' title='opens in new tab or window'>rawgithub</a>__


<a id="extending-natives"></a>
Extending Natives?
==================

YES, you can inherit from Native functions, but there are some caveats - see the 
[test/extend/using-natives.js](https://github.com/dfkaye/Constructor/blob/master/test/extend/using-natives.js) 
file for a complete implementation of a SubArray that inherits from the native 
Array constructor.

And the caveats?  The use of the internal [[Class]] identifier in the JS engines 
differs between IE 6-8 and all the others (not surprisingly) - but all have a 
common restriction in that special methods based on the [[Class]] will fail on 
any objects not identified as constructed by that [[Class]].

__tl;dr__
 
* subclassing Array requires overwriting `concat()` and `toString()` methods. 
* IE 6-8 iterations fail on `this.length` on subarray instances.  
* IE 6-7 don't allow subclasses to inherit any methods in this implementation of 
  constructor inheritance.

npm
---

___TODO___