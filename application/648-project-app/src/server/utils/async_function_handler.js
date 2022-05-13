/*
Async wrapper, similar style to python

Notes:
    Handles Function and Async Functions

Reference:
    Authentication in Node.js - #5 Error Handling
        https://www.youtube.com/watch?v=5Hpv6fLf93Q
            Notes:
                Uses typeScript
                Advanced with ambiguous calls

    Javascript - Create a Wrapper Class
        https://www.youtube.com/watch?v=1bmRVC7eiik

    async / await in JavaScript - What, Why and How - Fun Fun Function
        https://www.youtube.com/watch?v=568g8hxJJp4
            Notes:
                Pretty good async to learn and understand async

    Async JS Crash Course - Callbacks, Promises, Async Await
        https://www.youtube.com/watch?v=PoRJizFvM7s
            Notes:
                Pretty good async basics

    The Async Await Episode I Promised
        https://www.youtube.com/watch?v=vn3tm0quoqE
            Notes:
                Pretty good async examples

    Asynchronous Vs Synchronous Programming
        https://www.youtube.com/watch?v=Kpn2ajSa92c

    JavaScript Async Await
        https://www.youtube.com/watch?v=V_Kr9OSfDeU

    Understanding async/await on NodeJS
        https://stackoverflow.com/a/44513231/9133458
*/

// Custom debugFull printer

// import RequestHandler from "express";
const debugPrinter = require('./debug_printer');

// Asynchronous function Error Handling Wrapper
/**
 *
 * @param functionGiven
 * @param debugPrinterFunction
 * @returns {(function(...[*]): (*|function(...[*])))|*}
 */
function asyncFunctionHandler(functionGiven, debugPrinterFunction = 'printMiddleware') {
    /*
    Anonymous wrapper function (Almost similar style to python decorators)

    Notes:
        Handle errors of a async function

    Alternative:
        return (...args) => {
    */
    function wrapper(...args) {
        /*

        This try catch is to catch an error if the error fails because it's async now...
        ya idk why I did this...

        */
        try {
            // Print the type of the function
            debugPrinter[debugPrinterFunction](functionGiven.name);

            /*
            Call original function and explicitly catch error

            Notes:
                Do not use .then(), ONLY .catch()
                    .then((callback) => {
                        // Enforce sequential code here?
                        return resultsFunctionCall;

                    })

                resultsFunctionCall
                    should be the global == this and is something related to node if there is no value returned

            Important Notes:
                DO NOT PUT result = await functionGiven(...args).catch((err) => {

            Alternative:
                return (...args).catch((err) => {
            */
            try {
                const resultsFunctionCall = functionGiven(...args);
                // Required for all functions
                return resultsFunctionCall;
            } catch (error) {
                debugPrinter.printError('Asynchronous Error Caught!');
                debugPrinter.printError(error);
            }
        } catch (error) {
            debugPrinter.printError('An Error has occurred while handling Asynchronous Errors!');
            debugPrinter.printError(error);
        }
    }

    return wrapper;
}

module.exports = asyncFunctionHandler;
