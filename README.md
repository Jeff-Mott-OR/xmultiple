# xmultiple
> Multiple inheritance with ES6 proxies.

Provides multiple inheritance in the same manner as JavaScript's native inheritance mechanism, by delegating to other objects. But rather than delegating to just one other object, as the prototype chain does, this library creates a proxy that will delegate to multiple other objects.

## Installation

```sh
$ npm install --save xmultiple
```

## Usage

```js
var xmultiple = require('xmultiple');

// Object inherits from multiple other objects
{
    const base1 = {'foo': 'foo'};
    const base2 = {'bar': 'bar'};
    const base3 = {'baz': 'baz'};

    const delegatesToMultiple = xmultiple(base1, base2, base3);
    delegatesToMultiple.foo // "foo"
    delegatesToMultiple.bar // "bar"
    delegatesToMultiple.baz // "baz"
}

// Class inherits from multiple other classes
{
    class Base1 {
        foo() {
            return 'foo';
        }
    }

    class Base2 {
        bar() {
            return 'bar';
        }
    }

    class Base3 {
        baz() {
            return 'baz';
        }
    }

    class DelegatesToMultiple extends xmultiple(Base1, Base2, Base3) {
    }

    const delegatesToMultiple = new DelegatesToMultiple();
    delegatesToMultiple.foo() // "foo"
    delegatesToMultiple.bar() // "bar"
    delegatesToMultiple.baz() // "baz"
}
```

## Notes

* The search for properties inherited from parents is depth-first, left-to-right. Thus, if a property is not found in `delegatesToMultiple`, it is searched for in `base1`, then (recursively) in the [[Prototype]] of `base1` through the normal prototype chain, and if it's not found there, it is searched for in `base2`, and so on.

## License

MIT © Jeff Mott

