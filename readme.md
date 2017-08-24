# CancelablePromise

Promise that can be canceled, learned from [sindresorhus/p-cancelable](https://github.com/sindresorhus/p-cancelable).

The difference from sindresorhus version is that CancelablePromise in this lib is not a subclass of Promise.

## Install

```
$ npm i @ybq/p-cancelable
```


## Usage

```
const PCancelable = require('@ybq/p-cancelable');

const cancelablePromise = new PCancelable((onCancel, resolve, reject) => {
    const worker = new SomeLongRunningOperation();

    onCancel(() => {
        worker.close();
    });

    worker.on('finish', resolve);
    worker.on('error', reject);
});

cancelablePromise
    .then(value => {
        console.log('Operation finished successfully:', value);
    })
    .catch(reason => {
        if (cancelablePromise.canceled) {
            // Handle the cancelation here
            console.log('Operation was canceled');
            return;
        }

        throw reason;
    });

// Cancel the operation after 10 seconds
setTimeout(() => {
    cancelablePromise.cancel();
}, 10000);

```

## API

### new PCancelable(executor)

Same as the [`Promise` constructor](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise), but with a prepended `onCancel` parameter in `executor`.

`PCancelable` is a subclass of `Promise`.

#### onCanceled(fn)

Type: `Function`

Accepts a function that is called when the promise is canceled.

You're not required to call this function.

### PCancelable#cancel()

Type: `Function`

Cancel the promise. The cancellation is synchronous.

Calling it after the promise has settled or multiple times does nothing.

### PCancelable#canceled

Type: `boolean`

Whether the promise is canceled.
