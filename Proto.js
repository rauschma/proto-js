////////// API //////////

// To be part of ECMAScript.next
if (!Object.getOwnPropertyDescriptors) {
    Object.getOwnPropertyDescriptors = function (obj) {
        return Object.getOwnPropertyNames(obj).map(function(propName) {
            return Object.getOwnPropertyDescriptor(source, propName);
        });
    };
}

/**
 * The root of all classes that adhere to "the prototypes as classes" protocol.
 * The neat thing is that the class methods "new" and "extend" are automatically
 * inherited by subclasses of this class (because Proto is in their prototype chain).
 */
var Proto = {
    /**
     * Class method: create a new instance and let instance method constructor() initialize it.
     * "this" is the prototype of the new instance.
     */
    new: function () {
        // Alternative: new this.constructor(). But: cannot forward "arguments".
        var instance = Object.create(this);
        if (instance.constructor) {
            instance.constructor.apply(this, arguments);
        }
        return instance;
    },
    
    /**
     * Class method: subclass "this" (a prototype object used as a class)
     */
    extend: function (subProps) {
        // We cannot set the prototype of "subProps"
        // => copy its contents to a new object that has the right prototype
        var subProto = Object.create(this, Object.getOwnPropertyDescriptors(subProps));

        // Ensure that constructor and prototype point to each other
        if (subProto.constructor) {
            subProto.constructor.prototype = subProto;
        }
        subProto.super = this; // for super-calls
        return subProto;
    },
};

////////// Demo //////////

/***** Code *****
// Superclass
var Person = Proto.extend({
    constructor: function (name) {
        this.name = name;
    },
    describe: function() {
        return "Person called "+this.name;
    },
});

// Subclass
var Worker = Person.extend({
    constructor: function (name, title) {
        Worker.super.constructor.call(this, name);
        this.title = title;
    },
    describe: function () {
        return Worker.super.describe.call(this)+" ("+this.title+")";
    },
});
*/

/***** Interaction *****
var jane = Worker.new("Jane", "CTO"); // normally: new Worker(...)
> Worker.isPrototypeOf(jane) // normally: jane instanceof Worker
true
> jane.describe()
'Person called Jane (CTO)'
*/
