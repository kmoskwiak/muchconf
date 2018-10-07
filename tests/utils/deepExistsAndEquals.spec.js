const test = require('ava');
const deepE = require('../../lib/utils/deepExistsAndEquals');

test('should pass the test if objects are indentical',  (t) => {
    const data = {
        p1: 1,
        p2: 2,
        p3: 3
    };

    let result = deepE({
        p1: 1,
        p2: 2,
        p3: 3
    }, data);

    t.is(true, result);
});

test('should pass the test if condition met',  (t) => {
    const data = {
        p1: 1,
        p2: 2,
        p3: 3
    };

    let result = deepE({
        p1: 1
    }, data);

    t.is(true, result);
});

test('should fail the test if condition not met',  (t) => {
    const data = {
        p1: 1,
        p2: 2,
        p3: 3
    };

    let result = deepE({
        p1: 2
    }, data);

    t.is(false, result);
});

test('should fail the test if one condition not met',  (t) => {
    const data = {
        p1: 1,
        p2: 2,
        p3: 3
    };

    let result = deepE({
        p1: 1,
        p2: 4
    }, data);

    t.is(false, result);
});

test('should pass the test if condition met (deep object)',  (t) => {
    const data = {
        p1: 1,
        p2: 2,
        p3: {
            p31: {
                p311: 3
            }
        }
    };

    let result = deepE({
        p3: {
            p31: {
                p311: 3
            }
        }
    }, data);

    t.is(true, result);
});

test('should fail the test if condition not met (deep object)',  (t) => {
    const data = {
        p1: 1,
        p2: 2,
        p3: {
            p31: {
                p311: 3
            }
        }
    };

    let result = deepE({
        p3: {
            p31: {
                p311: 4
            }
        }
    }, data);

    t.is(false, result);
});

test('should fail the test if one condition not met (different types)',  (t) => {
    const data = {
        p1: 1,
        p2: 2,
        p3: 3
    };

    let result = deepE({
        p1: 1,
        p2: '4'
    }, data);

    t.is(false, result);
});

test('should fail the test if one condition not met (property does not exists)',  (t) => {
    const data = {
        p1: 1,
        p2: 2,
        p3: 3
    };

    let result = deepE({
        p1: 1,
        not_exists: true
    }, data);

    t.is(false, result);
});

test('should pass the test if condition met (deep object with array)',  (t) => {
    const data = {
        p1: 1,
        p2: 2,
        p3: {
            p31: {
                p311: [1,2]
            }
        }
    };

    let result = deepE({
        p3: {
            p31: {
                p311: [1,2]
            }
        }
    }, data);

    t.is(true, result);
});

test('should fail the test if condition not met (deep object with array)',  (t) => {
    const data = {
        p1: 1,
        p2: 2,
        p3: {
            p31: {
                p311: [1,2]
            }
        }
    };

    let result = deepE({
        p3: {
            p31: {
                p311: [1,2,4]
            }
        }
    }, data);

    t.is(false, result);
});

test('should run custom function and pass the test', (t) => {
    const data = {
        p1: 1,
        p2: 2,
        p3: {
            p31: {
                p311: [1,2]
            }
        }
    };

    let result = deepE((_data) => {
        return data.p1 === 1;
    }, data);

    t.is(true, result);
});

test('should run custom function and pass the test (for specific key)', (t) => {
    const data = {
        p1: 1,
        p2: 2,
        p3: {
            p31: {
                p311: [1,2]
            }
        }
    };

    let result = deepE({
        p3: {
            p31: (_data) => {
                return _data.p311.length === 2;
            }
        }
    }, data);

    t.is(true, result);
});