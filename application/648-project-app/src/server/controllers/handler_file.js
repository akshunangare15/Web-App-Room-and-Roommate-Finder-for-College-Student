/*
File handler
 */

const util = require('util');
const fs = require('fs');
const wrapper = require('../utils/wrapper');

const handlerFile = {};

/**
 * Delete file locally
 *
 * @param absFilePath
 * @returns {Promise<unknown>}
 */
async function unlinkFileAsync(absFilePath) {
    return util.promisify(fs.unlink)(absFilePath);
}
handlerFile.unlinkFileAsync = unlinkFileAsync;

// handlerFile.unlinkFileAsync = wrapper.wrapperForNoTryCatchAsyncFunction(unlinkFileAsync);

module.exports = handlerFile;
