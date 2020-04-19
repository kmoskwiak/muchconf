const Provider = require('../../lib/Provider').default;

class UpdatingProvider extends Provider {
    constructor(options) {
        super(options);
        this.configuration = {
            a: 1,
            b: 2,
            c: 3
        };
        this.enableWatching();
        this.update();
    }

    update() {
        setTimeout(() => {
            this.configuration = {
                a: 4,
                b: 2,
                c: 3,
                d: 5
            };
            this.emit('update');
        }, 100);
    }

    load() {
        return Promise.resolve(this.configuration);
    }
}

module.exports = UpdatingProvider;