const test = require('ava');
const Provider = require('../lib/Provider').default;

test('should not convert strings by default', (t) => {
    const provider = new Provider();

    t.is('1', provider.parse('1'));
    t.is(1, provider.parse(1));

    t.is('true', provider.parse('true'));
    t.is(true, provider.parse(true));

    t.is('"value"', provider.parse('"value"'));
});

test('should convert string to number if option enabled', (t) => {
    const provider = new Provider({
        castNumbers: true
    });

    t.is(1, provider.parse('1'));
    t.is(1, provider.parse(1));
});

test('should convert string to boolean if option enabled', (t) => {
    const provider = new Provider({
        converTrueFalseStrings: true
    });

    t.is(true, provider.parse('true'));
    t.is(true, provider.parse('TRUE'));
    t.is(false, provider.parse('false'));
    t.is(false, provider.parse('FALSE'));
    t.is(true, provider.parse(true));
    t.is(false, provider.parse(false));
});

test('should cut quotations if option enabled', (t) => {
    const provider = new Provider({
        cutQuotations: true
    });

    t.is('value', provider.parse('"value"'));
    t.is('value', provider.parse('value'));
});

test('should trim string by default', (t) => {
    const provider = new Provider();

    t.is('value', provider.parse('value\n'));
    t.is('value', provider.parse('value  '));
    t.is('value', provider.parse(' value  '));
});

test('should not trim string if option is disabled', (t) => {
    const provider = new Provider({
        trim: false
    });

    t.is('value\n', provider.parse('value\n'));
    t.is('value  ', provider.parse('value  '));
    t.is(' value  ', provider.parse(' value  '));
});