Constructor.js
=====================

Constructor.js ~ constructor-, prototype- and parent- inheritance module. 

Motivation
==========

Though there are problems with inheritance, it should just work and JavaScript 
should support it.  [See this gist for details](https://gist.github.com/dfkaye/4948675 "constructor-api-proposal").

tape & testling
===============

Using tape to test in order to use testling.  tape works on node.js command line. 
testling worked for a while but has been broken lately because of browserify 
__which is so terrible you have no idea.__

[![browser support](http://ci.testling.com/dfkaye/Constructor.png)](http://ci.testling.com/dfkaye/Constructor)

Constructor API
===============

__Constructor(base)__ ~ specify a base object with 'constructor' defined as a 
    function.  If constructor is not defined, an empty function is provided.
    The constructor function's prototype is then set to the base object, and the
    function is returned.  If you pass in a function, that function is returned
    immediately withou modification.  Use of the 'new' keyword is optional.
    
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
    
    
__Prior Art__ ~ this implementation is based on the type() method suggested by
    Nicholas Zakas in his post [Custom types (classes) using object literals in 
    JavaScript](http://www.nczonline.net/blog/2011/11/04/custom-types-classes-using-object-literals-in-javascript/ 
    "Custom types (classes) using object literals in JavaScript")
    
__Constructor.extend(base, child)__ ~ specify a base object or function to inherit 
    from, and a child object or function that will inherit from the base.  The
    base is referenced from the child by __this.parent__.  In the constructor,
    use it as a function call initially, then as an object thereafter.
    
    Example - hastily presented:

    ConfigurableDialog = Constructor(Dialog, {
        constructor: function Dialog(contentNode, state) {
        
            this.parent(contentNode); // first use of parent
            
            this.state = state;
            
            if (this.state.displayOnCreate === true && !this.state.shown) {
                this.show();
            }
        },
        hide: function () {
            if (this.state.shown) {
            
                this.parent.hide(); // __delegate to the parent__
                
                this.state.shown = false;
            }
        },
        show: function () {
            if (!this.state.shown) {
            
                this.parent.show(); // delegate to the parent
                
                this.state.shown = true;
            }
        }
    });
    
    
Statics or Class-level properties
=================================

These are __not__ inherited by the Constructor.extend() operation as statics are 
defined on a constructor directly, not on its prototype (which provides a map 
for instances).  Inheriting statics is not regarded as a good practice anyway in
Java land.  

In the JavaScript world, using Constructor.js, you can still access such
properties by referring to the parent.constructor (no call or apply necessary):

    Example
    
    Request = Constructor({
    
    });
    
    Request.staticMethod = function (obj) {
        // do something with obj
    };
    
    Post = Constructor.extend(Post, {
        constructor: function () {
        
        },
        accessParentStatic: function () {
            
            return this.parent.constructor.staticMethod(this);
        }
    });
    

Tests
=====

* base case tests __done for now__
* extend case tests ___done for now___
* anti-pattern tests, inherit-statics, using-natives ___done for now___


On Node.js command line:
=========================

    cd ./Constructor
  
    node test/base/anti-patterns.js
    node test/base/base-patterns.js
    node test/base/using-natives.js
    
    node test/extend/anti-patterns.js 
    node test/extend/extend-patterns.js
    node test/extend/using-natives.js
    node test/extend/inherit-statics.js 
    
    
The /base and /extend test cases show the intended usage of Constructor() and 
Constructor.extend().

The /base and /extend directories contain an ___anti-patterns.js___ test which 
shows a few clever and/or misguided uses that have surprising side-effects. 

Under /extend is the inherit-statics.js tests which shows how to access a static 
attribute from a parent constructor, but goes into some detail about the example
from which this test is derived.   The example is taken from __Programming in 
CoffeeScript__ by Mark Bates, Addison-Wesley, pp. 147-150, where the author 
shows that CoffeeScript does not support static inheritance through the 
__super__ keyword.  However, the example contains a more fundamental problem NOT 
specific to CoffeeScript.

*There will be a rant about that example on my [gists](https://gist.github.com/dfkaye) eventually.*


Extending Natives?
==================

YES, you can inherit from Native functions but there are some caveats - see the 
[test/extend/using-natives.js](https://github.com/dfkaye/Constructor/blob/master/test/extend/using-natives.js) 
file for a complete implementation of a SubArray that inherits from the native 
Array constructor.


git & github
============

Get comfortable with command line (git bash ftw) and github (just about painless). 

___Always edit package.json on github directly to remove leading whitespace___


npm
============

___TODO___