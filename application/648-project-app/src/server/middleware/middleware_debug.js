/*

Reference:
    Syntax for an async arrow function
        Notes:
            Async Function style
        Reference:
            https://stackoverflow.com/questions/42964102/syntax-for-an-async-arrow-function

 */
const path = require('path');
const debugPrinter = require('../utils/debug_printer');

const BORDER_SIZE = 20;

//        debugPrinter.printRoute(path.basename(__filename)); // TODO USE THIS SOMEWHERE

function printBeforeMiddlewareDebugFull(req, res, next, message) {
    debugPrinter.printBackendRed(`${'#'.repeat(BORDER_SIZE)} BEFORE MIDDLEWARE DEBUG [FULL] (START) ${'#'.repeat(BORDER_SIZE)}`);

    if (Array.isArray(message)) {
        message.forEach((element, index) => {
            debugPrinter.printBackendMagenta(element);
        });
    } else if (message) {
        debugPrinter.printBackendMagenta(message);
    }

    debugPrinter.printDebug('req.headers');
    console.log(req.headers);
    debugPrinter.printDebug('req.protocol');
    console.log(req.protocol);
    debugPrinter.printDebug('req.ip');
    console.log(req.ip);
    debugPrinter.printDebug('req.hostname');
    console.log(req.hostname);

    debugPrinter.printDebug('req.method');
    console.log(req.method);

    debugPrinter.printDebug('req.path');
    console.log(req.path);
    debugPrinter.printDebug('req.url');
    console.log(req.url);
    debugPrinter.printDebug('req.originalUrl');
    console.log(req.originalUrl);
    /*
        Example for req.query.search and req.query.name

            Client:
                http://website/user?search=YouTube&name=Bob

            Server:
                app.get("/search")

            Result:
                req.search.id === 'YouTube'
                req.search.name === 'Bob'

     */
    debugPrinter.printDebug('req.query');
    console.log(req.query); // Query string
    /*
        Example for req.params.id
            Client:
                http://website/user/123

            Server:
                app.get("/user/:id")
                app.get("/listing/:id") // Not in this example

            Result:
                req.params.id === 123

     */
    debugPrinter.printDebug('req.params');
    console.log(req.params);

    debugPrinter.printDebug('req.body');
    console.log(req.body);

    debugPrinter.printDebug('req.session');
    console.log(req.session);

    debugPrinter.printDebug('req.user');
    console.log(req.user);

    debugPrinter.printDebug('req.form');
    console.log(req.form);

    debugPrinter.printDebug('req.file');
    console.log(req.file);

    debugPrinter.printDebug('req.files');
    console.log(req.files);

    debugPrinter.printBackendRed(`${'#'.repeat(BORDER_SIZE)} BEFORE MIDDLEWARE DEBUG [FULL] (END) ${'#'.repeat(BORDER_SIZE)}`);
}

function printBeforeMiddlewareDebugSimple(req, res, next, message) {
    debugPrinter.printBackendRed(`${'#'.repeat(BORDER_SIZE)} BEFORE MIDDLEWARE DEBUG [SIMPLE] (START) ${'#'.repeat(BORDER_SIZE)}`);

    if (Array.isArray(message)) {
        message.forEach((element, index) => {
            debugPrinter.printBackendMagenta(element);
        });
    } else if (message) {
        debugPrinter.printBackendMagenta(message);
    }
    debugPrinter.printBackendMagenta(`Original URL: ${req.originalUrl}`);

    /*
        Example for req.query.search and req.query.name

            Client:
                http://website/user?search=YouTube&name=Bob

            Server:
                app.get("/search")

            Result:
                req.search.id === 'YouTube'
                req.search.name === 'Bob'

     */
    debugPrinter.printDebug('req.query');
    console.log(req.query); // Query string
    /*
        Example for req.params.id
            Client:
                http://website/user/123

            Server:
                app.get("/user/:id")
                app.get("/listing/:id") // Not in this example

            Result:
                req.params.id === 123

     */
    debugPrinter.printDebug('req.params');
    console.log(req.params);

    debugPrinter.printDebug('req.body');
    console.log(req.body);

    debugPrinter.printDebug('req.session');
    console.log(req.session);

    debugPrinter.printDebug('req.user');
    console.log(req.user);

    debugPrinter.printDebug('req.form');
    console.log(req.form);

    debugPrinter.printDebug('req.file');
    console.log(req.file);

    debugPrinter.printDebug('req.files');
    console.log(req.files);

    debugPrinter.printBackendRed(`${'#'.repeat(BORDER_SIZE)} BEFORE MIDDLEWARE DEBUG [SIMPLE] (END) ${'#'.repeat(BORDER_SIZE)}`);
}

function printAfterMiddlewareDebugSimple(req, res, next, message) {
    debugPrinter.printBackendRed(`${'#'.repeat(BORDER_SIZE)} AFTER MIDDLEWARE DEBUG [SIMPLE] (START) ${'#'.repeat(BORDER_SIZE)}`);

    if (Array.isArray(message)) {
        message.forEach((element, index) => {
            debugPrinter.printBackendMagenta(element);
        });
    } else if (message) {
        debugPrinter.printBackendMagenta(message);
    }
    debugPrinter.printBackendMagenta(`Original URL: ${req.originalUrl}`);

    debugPrinter.printDebug('res.headersSent');
    console.log(res.headersSent);

    debugPrinter.printBackendRed(`${'#'.repeat(BORDER_SIZE)} AFTER MIDDLEWARE DEBUG [SIMPLE] (END) ${'#'.repeat(BORDER_SIZE)}`);
}

const middlewareDebug = {};

middlewareDebug.preMiddlewareDebugFullWithMessage = (messageBefore) => (req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        printBeforeMiddlewareDebugFull(req, res, next, messageBefore);
    }
    next();
};

middlewareDebug.preMiddlewareDebugSimpleWithMessage = (messageBefore) => (req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        printBeforeMiddlewareDebugSimple(req, res, next, messageBefore);
    }
    next();
};

// middlewareDebug.preMiddlewareDebugSimpleWithMessage = (messageAfter) => (req, res, next) => {
//     if (process.env.NODE_ENV === 'development') {
//         printAfterMiddlewareDebugSimple(req, res, next, messageAfter);
//     }
//     next();
// };

module.exports = middlewareDebug;
