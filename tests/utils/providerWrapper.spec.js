const test = require('ava')
const wrapper = require('../../lib/utils/providerWrapper');

class MyClass {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    abc() {
        return [this.a, this.b, this.c];
    }
}

test('should call constructor with arguments', async (t) => {
    const myWrapper = wrapper(MyClass);
    let wrapped = myWrapper(1,2,3);
    t.deepEqual([1,2,3], wrapped.abc());
});
