/*
Common constants file
 */

const path = require('path');
const debugPrinter = require('../utils/debug_printer');

const constants = {};

constants.PATH_ROUTE_IMAGES = '/api/images/';

constants.PATH_FILE_UPLOAD = path.join(__dirname, 'temp', 'upload');

debugPrinter.printDebug(__dirname);

module.exports = constants;
