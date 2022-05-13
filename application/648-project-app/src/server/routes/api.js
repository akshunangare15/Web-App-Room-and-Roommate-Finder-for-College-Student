const express = require('express');
const path = require('path');

const routerImages = require('./images');
const routerUser = require('./user');
const routerListing = require('./listing');
const routerListings = require('./listings');

const middlewareDebug = require('../middleware/middleware_debug');

const routerAPI = express.Router();

routerAPI.use(middlewareDebug.preMiddlewareDebugFullWithMessage('Route: api'));

routerAPI.use('/images', routerImages); // TODO SHOULD BE /image

routerAPI.use('/user', routerUser);

routerAPI.use('/listing', routerListing);

routerAPI.use('/listings', routerListings);

module.exports = routerAPI;
