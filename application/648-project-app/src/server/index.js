// const express = require("express");
// const app = express();
// const path = require("path");
// const PORT = process.env.PORT || 3000;

// app.use(express.static(__dirname + "/intro")); // USE THIS FORMAT

// USE THIS FORMAT (Has favicon.ico so the Elastic Beanstalk will stop complaining)
// app.use(express.static(__dirname + "/public"));

// app.get("/HTTP/1.1", (req, res) => {
//     // https://stackoverflow.com/questions/38158027/express-4-14-how-to-send-200-status-with-a-custom-message
//     res.send();
// })

// // Check console
// app.listen(PORT, () => {
//     console.log("From index.js")

// })

// app.use(express.json());
// app.use(express.static("dist")); // serves all the files within dist folder whenever a client connects

// const db = require('../config/database_mysql2');

const express = require('express');

const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const expressSession = require('express-session');

const secrets = require('./config/config.json');

/*
Connect express-session when using Sequelize

https://www.npmjs.com/package/connect-session-sequelize

 */
const ConnectSessionSequelize = require('connect-session-sequelize')(
    expressSession.Store,
);

const passport = require('passport');
const sequelizeObject = require('./config/database_sequelize');

const routerAPI = require('./routes/api');

const debugPrinter = require('./utils/debug_printer');

const app = express(); // Web server

/*
Sets up HTTP headers
Reference:
    https://www.npmjs.com/package/helmet
 */
// app.use(helmet());

/*
morgan
Reference:
    https://www.npmjs.com/package/morgan
 */
app.use(morgan('combined'));

// Allow access to data from form tag  https://stackoverflow.com/questions/55558402/what-is-the-meaning-of-bodyparser-urlencoded-extended-true-and-bodypar TODO CLEAN ME
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Body Parser Middleware (Allow json parsing)

/*
Because we use Sequelize, we need a specific store which can be made by using
connect-session-sequelize to create the store for us

 */
// const extendDefaultFields = (defaults , session) => {
//   return {
//     data: defaults.data,
//     expires: defaults.expires,
//     userName: session.userName,
//   };
// };
// A express session store using sequelize made using connect-session-sequelize (a wrapper object)
const sequelizeExpressSessionStore = new ConnectSessionSequelize({
    db: sequelizeObject,
});

app.use(
    expressSession({
        secret: secrets.express_session_secret,
        resave: false, // Resave when nothing is changed
        saveUninitialized: false, // Save empty value in the session
        store: sequelizeExpressSessionStore, // Use the Store made from connect-session-sequelize
        cookie: {
            httpOnly: false,
            //     secure: true, // THIS REQUIRES THAT THE CONNECTION IS SECURE BY USING HTTPS (https://github.com/expressjs/session#cookiesecure)
            //     maxAge: 86400, // 1 Week long cookie
        },
    }),
);

// Sync the express sessions table (If the table does not exist in the database, then this will create it)
sequelizeExpressSessionStore.sync();

const handlerPassport = require('./controllers/handler_passport');
const middlewareDebug = require('./middleware/middleware_debug');
// Config passport
handlerPassport.configurePassportLocalStrategy(passport);

// In a Connect or Express-based application, passport.initialize() middleware is required to initialize Passport.
app.use(passport.initialize()); // Initialize password middleware

/*
If your application uses persistent login sessions, passport.session() middleware must also be used.
(Serialize and deserialize. Persist the login)
*/
app.use(passport.session());

/* <-------------------------------------------------- FRONTEND --------------------------------------------------> */

/*
React

Notes:
    The Frontend
    Serves all the files within dist folder whenever a client connects
 */

// debugPrinter.printBackendRed(path.join(__dirname, '../', '/client'));
// if (process.env.NODE_ENV === 'development') {
//     app.use('/', express.static(path.join(__dirname, '../', '/client', 'index.js')));
// } else {
//     app.use(express.static('dist'));
// }

app.use(express.static('dist'));

// app.use('/uploads/images', express.static(path.join(__dirname, 'uploads', 'images')));

/* <-------------------------------------------------- BACKEND --------------------------------------------------> */

// Middleware: Router Index
app.use(middlewareDebug.preMiddlewareDebugFullWithMessage('Route: index'));

// Use the api router
app.use('/api', routerAPI);

// Middleware: Route Error
app.use(
    middlewareDebug.preMiddlewareDebugFullWithMessage(
        'Route: Error',
        'THIS IS A SERVER ERROR',
    ),
    (err, req, res, next) => {
        if (process.env.NODE_ENV === 'development') {
            debugPrinter.printBackendRed(
                `${'#'.repeat(20)} SERVER ERROR ${'#'.repeat(20)}`,
            );

            // debugPrinter.printError(req, res, next); // Looks less readable
            console.log(err);
        } else {
            console.log(err);
        }

        res.json({ message: 'Something went wrong on our end' });
    },
);

module.exports = app;
