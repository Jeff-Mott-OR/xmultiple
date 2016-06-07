'use strict';

const assert = require('assert');
const xmultiple = require('../lib');

describe('xmultiple', function () {
  it('should inherit object properties', function () {
    // Parent objects
    let x = { x: {} };
    let y = { y: {} };
    let z = { z: {} };

    // Derived from multiple parents
    let d = xmultiple(x, y, z);

    // Expect d to inherit from x, y, z
    assert.equal(d.x, x.x);
    assert.equal(d.y, y.y);
    assert.equal(d.z, z.z);

    // Expect d to not own properties
    assert(!d.hasOwnProperty('x'));
    assert(!d.hasOwnProperty('y'));
    assert(!d.hasOwnProperty('z'));

    // Expect monkey patching parents to be reflected in derived
    x.x = {};
    y.y = {};
    z.z = {};
    assert.equal(d.x, x.x);
    assert.equal(d.y, y.y);
    assert.equal(d.z, z.z);
  });

  it('should inherit class prototype properties', function () {
    // Parent classes
    class X {
      x() {}
    }
    class Y {
      y() {}
    }
    class Z {
      z() {}
    }

    // Derived from multiple parents
    class D extends xmultiple(X, Y, Z) {}
    let d = new D();

    // Expect d to inherit from X, Y, Z prototypes
    assert.equal(d.x, X.prototype.x);
    assert.equal(d.y, Y.prototype.y);
    assert.equal(d.z, Z.prototype.z);
  });

  it('should inherit class static properties', function () {
    // Parent classes
    class X {
      static x() {}
    }
    class Y {
      static y() {}
    }
    class Z {
      static z() {}
    }

    // Derived from multiple parents
    class D extends xmultiple(X, Y, Z) {}

    // Expect D to inherit from X, Y, Z
    assert.equal(D.x, X.x);
    assert.equal(D.y, Y.y);
    assert.equal(D.z, Z.z);
  });

  it('should not access object properties more than once', function () {
    let foo = {
      n: 0,
      get incrementOnAccess() {
        return ++this.n;
      }
    };

    let d = xmultiple(foo);
    assert.equal(d.incrementOnAccess, 1);
    assert.equal(d.incrementOnAccess, 2);
  });
});
