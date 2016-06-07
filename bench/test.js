var xmultiple = require('../');

module.exports = {
  name: 'Multiple Inheritance Showdown',
  tests: {
    'xmultiple object delegates to multiple': (function() {
        // Preparation code
        const base1 = {
            foo() {
                return 'foo';
            }
        };

        const base2 = {
            bar() {
                return 'bar';
            }
        };

        const base3 = {
            baz() {
                return 'baz';
            }
        };

        const delegatesToMultiple = xmultiple(base1, base2, base3);

        // Test
        return function() {
            delegatesToMultiple.foo();
            delegatesToMultiple.bar();
            delegatesToMultiple.baz();
        };
    }()),

    'xmultiple class delegates to multiple': (function() {
        // Preparation code
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

        // Test
        return function() {
            delegatesToMultiple.foo();
            delegatesToMultiple.bar();
            delegatesToMultiple.baz();
        };
    }()),

    'baseline pre-merged object literal': (function() {
        // Preparation code
        const preMergedObjectLiteral = {
            foo() {
                return 'foo';
            },

            bar() {
                return 'bar';
            },

            baz() {
                return 'baz';
            }
        };

        // Test
        return function() {
            preMergedObjectLiteral.foo();
            preMergedObjectLiteral.bar();
            preMergedObjectLiteral.baz();
        };
    }()),

    'object.assign object from multiple': (function() {
        // Preparation code
        const base1 = {
            foo() {
                return 'foo';
            }
        };

        const base2 = {
            bar() {
                return 'bar';
            }
        };

        const base3 = {
            baz() {
                return 'baz';
            }
        };

        const assignedFromMultiple = Object.assign({}, base1, base2, base3);

        // Test
        return function() {
            assignedFromMultiple.foo();
            assignedFromMultiple.bar();
            assignedFromMultiple.baz();
        };
    }()),

    'object.create object with multiple mixins': (function() {
        // Preparation code
        const base1 = {
            foo() {
                return 'foo';
            }
        };

        const base2 = {
            bar() {
                return 'bar';
            }
        };

        const base3 = {
            baz() {
                return 'baz';
            }
        };

        const delegatesToOneAssignedFromMultiple = Object.assign(Object.create(base1), base2, base3);

        // Test
        return function() {
            delegatesToOneAssignedFromMultiple.foo();
            delegatesToOneAssignedFromMultiple.bar();
            delegatesToOneAssignedFromMultiple.baz();
        };
    }()),
  }
};
