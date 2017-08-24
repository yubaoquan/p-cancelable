const test = require('ava');

const SomeLongRunningOperation = require('./SomeLongRunningOperation');
const PCancelable = require('./index');

const promises = [];
promises.push(createCancelablePromise());
promises.push(createCancelablePromise());
promises.push(createCancelablePromise(true));

function createCancelablePromise(shouldFail) {
    const cancelablePromise = new PCancelable((onCancel, resolve, reject) => {
        const worker = new SomeLongRunningOperation(shouldFail);

        onCancel(() => {
            console.info('canceled');
            worker.close();
        });

        worker.on('finish', resolve);
        worker.on('error', (err) => {
            console.info('err', err);
            return reject(err);
        });
    });

    cancelablePromise
        .then(value => {
            // console.log('Operation finished successfully:', value);
            return value;
        })
        .catch(reason => {
            console.info('catch');
            if (cancelablePromise.canceled) {
                // Handle the cancelation here
                console.log('Operation was canceled');
                return;
            }
            throw reason;
        });
    return cancelablePromise;
}

test('it should be canceld', (t) => {
    const p0 = promises[0];
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            p0.cancel();
            t.true(p0.canceled);
            resolve();
        }, 1000);
    })
});

test('it should get a success result', (t) => {
    const p1 = promises[1];
    return new Promise((resolve, reject) => {
        return p1.then((res) => {
            t.is(res, 'succeed');
            resolve();
        }).catch((e) => {
            console.error(e);
        });
    });
});

test('it should fail and get a code 999', (t) => {
    const p2 = promises[2];
    return new Promise((resolve, reject) => {
        p2.catch((e) => {
            t.is(e, 999);
            resolve();
        });
    });
});
