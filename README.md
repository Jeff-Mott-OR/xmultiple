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

* Ambiguous calls (that is, collisions) will throw an error.

```js
class Base1 {
    foo() {}
}

class Base2 {
    foo() {}
}

class DelegatesToMultiple extends xmultiple(Base1, Base2) {
}

const delegatesToMultiple = new DelegatesToMultiple();
delegatesToMultiple.foo() // error! ambiguous, Base1#foo or Base2#foo?
```

* It's slow. It's a couple orders of magnitude slower than either `Object.assign` or [subclass factories](http://www.2ality.com/2016/05/six-nifty-es6-tricks.html#simple-mixins-via-subclass-factories). I hope it will get faster over time.

* Calling super constructors is problematic. Calling `super()` will invoke only the singular home object, but neither can the proxy iteratively invoke each super constructor since class constructors can't be function-called.

## Alternative

If this library doesn't meet your needs, instead consider [subclass factories](http://www.2ality.com/2016/05/six-nifty-es6-tricks.html#simple-mixins-via-subclass-factories).

```js
const Base1 = (Sup = Object) => class extends Sup {
    foo() {}
};
const Base2 = (Sup = Object) => class extends Sup {
    bar() {}
};
const Base3 = (Sup = Object) => class extends Sup {
    baz() {}
};

class DelegatesToMultiple extends Base1(Base2(Base3())) {}
```

## License

MIT © Jeff Mott

