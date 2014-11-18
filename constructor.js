/**
 *  file:  constructor.js - provides construction prototype and __super__ 
 *         inheritance to JavaScript
 *  author:   @dfkaye - david.kaye
 *  date: 2012-10-30
 *
 *  To-DO (if ever)
 *    - better 'actual' support for extending natives (like Array) - could be 
 *      bikeshedding, though...
 *
 *   11/20/12
 *      copied over to local
 *
 *   12/23/12
 *      renamed method .create to .extend
 *      made .extend require both args, not just one
 *      re-formatted defn to IIFE for pseudo-commonjs
 *
 *   3/3/13
 *      github repo opened ~ test factorings in progress
 *
 *   12/3/13
 *      change parent to __super__
 *      change exports support
 *
 *   3/27/14
 *      expose static __super__ and __super__.constructor properties
 *
 *   11/10/14
 *      Change API and implementation to a simpler one by mytharcher
 */

;(function (exports) {

  if (typeof module != 'undefined' && module.exports) {
    module.exports = Constructor;
  } else {
    exports.Constructor = Constructor;
  }

  /*
   *  @constructor function Constructor
   *
   *  @param source - required - source must be an object specifier
   *  @param Super - Super must be a function
   *  @return function - the new constructor function
   */

  function Constructor (source, Super) {
    var sourceType = typeof source;
    var error = "Constructor(): invalid 'source' argument, must be a object, but was ";
    var i, newClass;

    if ('undefined' === sourceType) {
      throw new ReferenceError(error + "undefined");
    }

    if ('object' !== sourceType && 'function' !== sourceType || source === null) {
      throw new TypeError(error + ('object' != sourceType  ? sourceType + " [" + source + "]" : "null"));
    }

    if ('function' === sourceType) {
      newClass = source;

      if (!Super) {
        return source;
      }
    } else {
      // use noop function as default constructor if user not defined as in Java
      newClass = source.hasOwnProperty('constructor') ? source.constructor : function () {};
    }
    
    if (Super) {
      if (newClass === Super) {
        throw Erro('Constructor(): the constructor of new class should not be same as super.')
      }
      var SuperHelper = function () {};
      
      SuperHelper.prototype = Super.prototype;
      
      // make `instanceof` could be use to check the inheritance relationship
      newClass.prototype = new SuperHelper();
      
      // fix constructor function
      newClass.prototype.constructor = newClass;
      
      // copy static members from super class to new class (not override)
      for (i in Super) {
        if (!newClass.hasOwnProperty(i) && Super.hasOwnProperty(i)) {
          newClass[i] = Super[i];
        }
      }
      
      SuperHelper = null;
    }
    
    // copy user defined prototype members back to new class
    for (i in source) {
      if (source.hasOwnProperty(i)) {
        newClass.prototype[i] = source[i];
      }
    }
   
    return newClass;
  }

})(this);
