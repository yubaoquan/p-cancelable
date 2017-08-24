
function SomeLongRunningOperation(shouldFail) {
    this.listeners = {};
    this.task = setTimeout(() => {
        if (shouldFail) {
            (this.listeners.error || []).forEach((listener) => {
                listener(999);
            })
        } else {
            (this.listeners.finish || []).forEach((listener) => {
                listener('succeed');
            });
        }
    }, 1000 * 2);
}

SomeLongRunningOperation.prototype.close = function() {
    clearTimeout(this.task);
    console.info('worker closed');
}

SomeLongRunningOperation.prototype.on = function(msg, fn) {
    this.listeners[msg] = this.listeners[msg] || [];
    this.listeners[msg].push(fn);
}

module.exports = SomeLongRunningOperation;
