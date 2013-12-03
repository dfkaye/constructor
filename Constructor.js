/**
 *  file:  Constructor.js - provides construction prototype and __super__ inheritance to JavaScript
 *  author:   @dfkaye - david.kaye
 *	date:	2012-10-30
 *
 *	To-DO (if ever)
 *    - better 'actual' support for extending natives (like Array) - could be bikeshedding, though...
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
 */

;(function (exports) {

    exports = (typeof module != 'undefined' && module.exports) || window;
    exports.Constructor = Constructor;

    /**
     *  @constructor function Constructor
     *
     *  @param source - source must be either a function or an object specifier
     *  @return function - the new constructor function
     */


    /**
     * [Constructor description]
     * @param {[type]} source
     */
    function Constructor(source) {

        var sourceType = typeof(source);
        var error = "Constructor(): invalid 'source' argument, must be a function or prototype, but was ";
        var ctr;

        if ('function' === sourceType) {
            return source;
        }

        if ('undefined' === sourceType) {
            throw new ReferenceError(error + "undefined");
        }

        if ('object' !== sourceType || source === null) {
            throw new TypeError(error + ('object' != sourceType  ? sourceType + " [" + source + "]" : "null"));
        }

        ctr = source.constructor !== Object ? source.constructor : function () {};

        ctr.prototype = source;
        ctr.prototype.constructor = ctr;

        return ctr;
    }

    /**
     *  @method Constructor.extend
     *
     *  @param source - required - source must be either a function or an object specifier
     *  @param target - required - target must be either a function or an object specifier
     *  @return function - the new constructor function
     */
    Constructor.extend = extend;

    function extend(source, target) {

        var error = 'Constructor.extend(): ';

        if (arguments.length < 2) {
            throw new TypeError(error + 'requires 2 arguments, source and target.');
        }

        var sourceType = typeof(source);
        var targetType = typeof(target);

        /*
           *  pass-through if not functions; let Constructor throw errors if not objects either;
           */
        var newSource = (sourceType !== 'function') ? new Constructor(source) : source;
        var newConstructor = (targetType !== 'function') ? new Constructor(target) : target;

        if (newSource == newConstructor) {
            throw new ReferenceError(error + ' source and target arguments should not be identical');
        }

        var newPrototype;

        function F() {}

        newConstructor.__super__ = F;
        F.prototype = newSource.prototype;
        newPrototype = new F();

        /*
           *  In order to support the target argument as an object specifier, we have
           *  to take the extra step of copying out its properties onto the new target
           *  function's prototype.
           */
        if (targetType === 'object') {

            var proto = newConstructor.prototype;

            for (var k in proto) {
                if (proto.hasOwnProperty(k)) {
                    newPrototype[k] = proto[k];
                }
            }
        }

        /*
           * yes this makes 'constructor' an enumerable property
           */
        newPrototype.constructor = newConstructor;

        /*
           *  @method __super__ - a call-once method for initializing the super/parent constructor of
           *  this constructor.  __super__ is replaced with an instance of the super/parent.
           */
        newPrototype.__super__ = function () {

            var __super__ = this.constructor.__super__;
            var p = new __super__();

            p.constructor.apply(p, arguments);

            for (var k in p) {
                if (p.hasOwnProperty(k)) {
                    this[k] = p[k];
                }
            }

            this.__super__ = p;

            return this;
        };

        newConstructor.prototype = newPrototype;

        return newConstructor;
    }

}());
