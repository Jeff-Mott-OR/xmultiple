'use strict';

/**
 * Creates a proxy object that delegates property accesses to not just one other
 * object (as the prototype chain does) but to multiple other objects.
 *
 * @param {...Object|...ConstructorFunction} parents An argument list consisting
 *     entirely of plain objects or entirely of constructor functions.
 * @return {Proxy}
 *
 * @example
 *
 *     const base1 = {'foo': 'foo'};
 *     const base2 = {'bar': 'bar'};
 *     const base3 = {'baz': 'baz'};
 *
 *     const delegatesToMultiple = xmultiple(base1, base2, base3);
 *     delegatesToMultiple.foo // "foo"
 *     delegatesToMultiple.bar // "bar"
 *     delegatesToMultiple.baz // "baz"
 *
 * @example
 *
 *     class Base1 {
 *         foo() {
 *             return 'foo';
 *         }
 *     }
 *
 *     class Base2 {
 *         bar() {
 *             return 'bar';
 *         }
 *     }
 *
 *     class Base3 {
 *         baz() {
 *             return 'baz';
 *         }
 *     }
 *
 *     class DelegatesToMultiple extends xmultiple(Base1, Base2, Base3) {
 *     }
 *
 *     const delegatesToMultiple = new DelegatesToMultiple();
 *     delegatesToMultiple.foo() // "foo"
 *     delegatesToMultiple.bar() // "bar"
 *     delegatesToMultiple.baz() // "baz"
 */
function xmultiple(...parents) {
    // For now, ensure homogeneous parents
    // That is, objects multi-inherit from objects, and classes multi-inherit from classes
    // In the future, might loosen this restriction, but for now, keeping it simple
    const isEveryParentObject = parents.every(parent => typeof(parent) === 'object');
    const isEveryParentClass = parents.every(parent => typeof(parent) === 'function');

    // Forward to more specialized functions depending on argument types
    if (isEveryParentObject) {
        return xmultipleObjects(parents);
    } else if (isEveryParentClass) {
        return xmultipleClasses(parents);
    } else {
        throw new TypeError('Either every parent should be an ordinary object or every parent should be a class.');
    }
}

/**
 * Creates a proxy that delegates to multiple other plain objects.
 *
 * @param {Array<Object>} parents The list of objects to delegate to.
 * @param {any=Object.create(null)} proxyTarget Object for the proxy to
 *     virtualize. Some characteristics of the proxy are verified against the
 *     target. For example, for the proxy to be considered constructible, the
 *     target must be constructible.
 * @return {Proxy}
 */
function xmultipleObjects(parents, proxyTarget = Object.create(null)) {
    // Create proxy that traps property accesses and forwards to each parent, returning the first defined value we find
    const forwardingProxy = new Proxy(proxyTarget, {
        get: function (proxyTarget, propertyKey) {
            // The proxy target gets first dibs
            // So, for example, if the proxy target is constructible, this will find its prototype
            if (Object.prototype.hasOwnProperty.call(proxyTarget, propertyKey)) {
                return proxyTarget[propertyKey];
            }

            // Check every parent for the property key
            // We might find more than one defined value if multiple parents have the same property
            const foundValues = parents.reduce(function(foundValues, parent) {
                // It's important that we access the object property only once,
                // because it might be a getter that causes side-effects
                const currentValue = parent[propertyKey];
                if (currentValue !== undefined) {
                    foundValues.push(currentValue);
                }

                return foundValues;
            }, []);

            // Just because we found multiple values doesn't necessarily mean there's a collision
            // If, for example, we inherit from three plain objects that each inherit from Object.prototype,
            // then we would find three references for the key "hasOwnProperty"
            // But that doesn't mean we have three different functions; it means we have three references to the *same* function
            // Thus, if every found value compares strictly equal, then don't treat it as a collision
            const firstValue = foundValues[0];
            const areFoundValuesSame = foundValues.every(value => value === firstValue);
            if (!areFoundValuesSame) {
                throw new Error(`Ambiguous property: ${propertyKey}.`);
            }

            return firstValue;
        }
    });

    return forwardingProxy;
}

/**
 * Creates a proxy that delegates to multiple other constructor functions and
 * their prototypes.
 *
 * @param {Array<ConstructorFunction>} parents The list of constructor functions
 *     to delegate to.
 * @return {Proxy}
 */
function xmultipleClasses(parents) {
    // A dummy constructor because a class can only extend something constructible
    function ConstructibleProxyTarget() {}

    // Replace prototype with a forwarding proxy to parents' prototypes
    ConstructibleProxyTarget.prototype = xmultipleObjects(parents.map(parent => parent.prototype));

    // Forward static calls to parents
    const ClassForwardingProxy = xmultipleObjects(parents, ConstructibleProxyTarget);

    return ClassForwardingProxy;
}

module.exports = xmultiple;
