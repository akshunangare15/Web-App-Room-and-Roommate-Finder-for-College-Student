/*
Utility function to wrap common functions that ar similar

 */
const debugPrinter = require('./debug_printer');

const wrapper = {};

/**
 * If a async function does not throw, and is not middleware, then wrap that given function with this function.
 * The purpose of this function is to reduce repeated code by putting a try catch over the given function
 * to catch errors thrown by that function. If an error is thrown, then null is returned.
 *
 * The reason why this function exists is because the given function is a unconventional async function.
 *
 * @param asyncFunction
 * @returns {(function(...[*]): (*|null|undefined))|*}
 */
wrapper.wrapperForNoTryCatchAsyncFunction = (asyncFunction) => {
    async function _wrapper(...args) {
        try {
            const result = await asyncFunction(...args);

            return result;
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                // This error is definitely bad...
                debugPrinter.printError(error);
            }
            return null;
        }
    }

    return _wrapper;
};

module.exports = wrapper;
