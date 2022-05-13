/*
Handles file uploads and multipart/form-data

Notes:
    This file assigns the multipart/form-data data to req.body and req.files/req.file

Reference:
    Uploading files using Node.js and Multer
        Reference:
            https://blog.logrocket.com/uploading-files-using-multer-and-node-js/

    Can Multer work without being a middleware? #417
        Reference:
            https://github.com/expressjs/multer/issues/417
 */
const multer = require('multer');
const { v4: uuid } = require('uuid');
const path = require('path');
const to = require('await-to-js');
const debugPrinter = require('../utils/debug_printer');
const constants = require('../config/constants');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const middlewareFormHandlerAndFileUpload = {};

/**
 * Custom error function that should replace the next function of the middleware from multer
 *
 * @param req
 * @param res
 * @param next
 * @returns {errorFunctionActual}
 */
function errorFunction(req, res, next) {
    function errorFunctionActual(error) {
        if (error) {
            res.json({
                message: error.message,
            });
        } else {
            next();
        }
    }

    return errorFunctionActual;
}

const multerHandler = multer({
    limits: 5000000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            // Where the file will be uploaded locally to this server
            cb(null, path.join(__dirname, '../', 'temp', 'upload'));
        },
        filename: (req, file, cb) => {
            // Filename of the uploaded file
            // Extension
            const ext = MIME_TYPE_MAP[file.mimetype];

            // Callback (error, filename)
            cb(null, `${uuid()}.${ext}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        // Validate file extension
        /*
        Check file extension

        Example:
            file
                {
                    fieldname: 'image',
                    originalname: 'test_image.jpg',
                    encoding: '7bit',
                    mimetype: 'image/jpeg'
                }

         */
        const isValid = !!MIME_TYPE_MAP[file.mimetype];

        // Determine if file extension is valid by throwing an error or not
        const error = isValid
            ? null // True
            : new Error( // False
                `Valid extensions are (${Object.keys(MIME_TYPE_MAP)
                    .join(
                        ', ',
                    )}) and not (${file.mimetype})`,
            );

        cb(error, isValid);
    },
});

/**
 * Mimic the multerHandler.single function of multer and intercept its next function from its middleware with an custom error function
 * to handle the error produced by multer. The error produced by multer will then be returned in a json format to the user.
 * The real purpose of this function is to prevent the server from interpreting the error by multer as a server error.
 * Basically, we are hijacking the error by multer and handling it with a custom result.
 *
 * @param name
 * @returns {middlewareMulterPseudo}
 */
function single(name) {
    function middlewareMulterPseudo(req, res, next) {
        const middlewareMulter = multerHandler.single(name);

        middlewareMulter(req, res, errorFunction(req, res, next));
    }

    return middlewareMulterPseudo;
}

middlewareFormHandlerAndFileUpload.single = single;

/**
 * Mimic the array function of multer and intercept its next function from its middleware with an custom error function
 * to handle the error produced by multer. The error produced by multer will then be returned in a json format to the user.
 * The real purpose of this function is to prevent the server from interpreting the error by multer as a server error.
 * Basically, we are hijacking the error by multer and handling it with a custom result.
 *
 * @param name
 * @param maxCount
 * @returns {middlewareMulterPseudo}
 */
function array(name, maxCount) {
    function middlewareMulterPseudo(req, res, next) {
        const middlewareMulter = multerHandler.array(name, maxCount);

        middlewareMulter(req, res, errorFunction(req, res, next));
    }

    return middlewareMulterPseudo;
}

middlewareFormHandlerAndFileUpload.array = array;

module.exports = middlewareFormHandlerAndFileUpload;
