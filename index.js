function CancelablePromise(fn) {
    this.resolveCb = () => {};
    this.rejectCb = () => {};
    this.cancelCb = () => {};
    const self = this;
    this.promise = new Promise((resolve, reject) => {
        function resolveWrap(res) {
            self.resolve(res);
            resolve();
        }
        function rejectWrap(err) {
            self.reject(err);
            reject();
        }
        fn(this.onCancel.bind(this), resolveWrap, rejectWrap);
    });


    this.promise
        .then((res) => {
            if (this.canceled) {
                return;
            }
            return this.resolveCb(this.resolvedValue);
        })
        .catch((err) => {
            if (this.canceled) {
                return;
            }
            return this.rejectCb(this.rejectedError);
        });
}

CancelablePromise.prototype.resolve = function(val) {
    this.resolvedValue = val;
}

CancelablePromise.prototype.reject = function(err) {
    this.rejectedError = err;
}

CancelablePromise.prototype.then = function(fn) {
    this.resolveCb = fn;
    return this;
}

CancelablePromise.prototype.catch = function(fn) {
    this.rejectCb = fn;
    return this;
}

CancelablePromise.prototype.cancel = function() {
    this.canceled = true;
    this.cancelCb();
}

CancelablePromise.prototype.onCancel = function(fn) {
    this.cancelCb = fn;
}

module.exports = CancelablePromise;
