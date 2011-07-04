////////// API //////////

// To be part of ECMAScript.next
if (!Object.getOwnPropertyDescriptors) {
    Object.getOwnPropertyDescriptors = function (obj) {
        return Object.getOwnPropertyNames(obj).map(function(propName) {
            return Object.getOwnPropertyDescriptor(source, propName);
        });
    };
}

var Proto = {
    new: function () {
        // new this.constructor() does not let us hand in the arguments
        // => we have to simulate it
        var instance = Object.create(this);
        if (instance.constructor) {
            instance.constructor.apply(this, arguments);
        }
        return instance;
    },
    extend: function (props) {
        // We cannot set the prototype of "properties"
        // => copy them to a new object that has the right prototype
        var subProto = Object.create(this, Object.getOwnPropertyDescriptors(props));

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
