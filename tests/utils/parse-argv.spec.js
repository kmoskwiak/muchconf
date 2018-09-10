const test = require('ava');
const parseArgv = require('../../lib/utils/parse-argv');

const argv = [
    '/pat/to/node', 
    'file.js', 
    'some_arg', 
    '--mongoUrl="mongo://localhost"',
    '--some-number=44',
    '--active=true'];

test('should parse options', (t) => {
    const config = parseArgv(argv);

    t.deepEqual(config, {
        "mongoUrl": '"mongo://localhost"',
        "some-number": "44",
        "active": "true"
    });
});