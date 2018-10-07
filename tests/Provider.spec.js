const test = require('ava');
const Provider = require('../lib/Provider');

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