/**
 *  file:  Constructor.js - provides construction prototype and parent inheritance to JavaScript
 *  author:   @dfkaye - david.kaye
 *	date:	2012-10-30
 *
 *	To-DO 
 *    - commonjs module support for global scope and exports
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
 */
;(function (exports) {

    exports.Constructor = Constructor;
    
    /**
     *  @constructor function Constructor
     *  
     *  @param source - source must be either a function or an object specifier
     *  @return function - the new constructor function
     */
    function Constructor(source) {

        var sourceType = typeof(source);
        var error = "Constructor(): invalid 'source' argument, must be a function or prototype, but was ";;
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

        //console.log('constructor: %s', source.hasOwnProperty('constructor'));
        
        ctr = source.constructor !== Object ? source.constructor : function () {};

        ctr.prototype = source;
        ctr.prototype.constructor = ctr;

        return ctr;
    };
    
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
        
        if (!newConstructor.toString().search(/this[\.]parent\(/)) {
            throw new SyntaxError(error + ' target specifier constructor missing call to this.parent()');
        }
        
        var F = F;
        var newPrototype;
        
        function F() {};
        
        newConstructor.parent = F;
        F.prototype = newSource.prototype;
        newPrototype = new F;

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
        
        newPrototype.constructor = newConstructor;

        /*
           *  @method parent - a call-once method for initializing the super/parent constructor of
           *  this constructor.  parent is replaced with an instance of the super/parent.
           */
        newPrototype.parent = function () {

            var parent = this.constructor.parent;
            var p = new parent;

            p.constructor.apply(p, arguments);

            for (var k in p) {
                if (p.hasOwnProperty(k)) {
                    this[k] = p[k];
                }
            }

            this.parent = p;

            return this;
        };

        newConstructor.prototype = newPrototype;

        return newConstructor;
    };
    
}(this));