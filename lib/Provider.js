const events = require('events');

class Provider extends events.EventEmitter {
    constructor() {
        super();
    }
}

module.exports = Provider;