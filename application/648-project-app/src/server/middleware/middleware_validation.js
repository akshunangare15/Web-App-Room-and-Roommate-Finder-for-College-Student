/*
Validation middleware for req.body

Notes:
    All functions here are middleware intended to validate req.body of all requests

Reference:
    any.warning(code, [context])
        Notes:
            Look at this:
                    const { value, warning } = await schema.validateAsync('anything', { warnings: true });
        Reference:
            https://joi.dev/api/?v=17.4.2#anywarningcode-context

*/
const to = require('await-to-js').default;

const joiSchemas = require('../utils/joi_schemas');
const debugPrinter = require('../utils/debug_printer');

async function validateCommon(req, res, next, schema, _backendErrorMessage) {
    // Values returned from validating key/value pairs form req.body call

    // Non async version
    // const {
    //     error,
    //     value,
    //     warning,
    // } = await schema.validate(req.body, { warnings: true });

    // Incorrect Async version using await-to-js
    // const [error,{
    //     value,
    //     warning,
    // }] = await to(schema.validateAsync(req.body, { warnings: true }));

    // const {value, warning } = await schema.validateAsync(req.body);

    // Correct Async version using await-to-js

    const [error, value] = await to(schema.validateAsync(req.body));

    if (error) { // If there was a validation error, respond with the validation error\
        res.json({
            status: 'failed',
            message: error.message,
        });
    } else { // Otherwise, go to the next middleware
        next();
    }
}

const middlewareValidation = {};

/**
 * Middleware to validate req.body used when signing up using the joi package
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
middlewareValidation.validateUserSignup = async (req, res, next) => {
    validateCommon(req, res, next, joiSchemas.SCHEMA_USER_SIGNUP, 'ERROR IN validateUserSignup');
};

/**
 *  Middleware to validate req.body used when logging in using the joi package
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
middlewareValidation.validateUserLogin = async (req, res, next) => {
    validateCommon(req, res, next, joiSchemas.SCHEMA_USER_LOGIN, 'ERROR IN validateUserLogin');
};

middlewareValidation.validateUserUpdate = async (req, res, next) => {
    validateCommon(req, res, next, joiSchemas.SCHEMA_USER_UPDATE, 'ERROR IN validateUserUpdate');
};

middlewareValidation.validateListingAdd = async (req, res, next) => {
    validateCommon(req, res, next, joiSchemas.SCHEMA_LISTING_ADD, 'ERROR IN validateListingAdd');
};

middlewareValidation.validateListingUpdate = async (req, res, next) => {
    validateCommon(req, res, next, joiSchemas.SCHEMA_LISTING_UPDATE, 'ERROR IN validateListingUpdate');
};

module.exports = middlewareValidation;
