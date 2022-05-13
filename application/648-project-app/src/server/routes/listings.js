const express = require('express');
const listingController = require('../controllers/controller_listing');
const middlewareDebug = require('../middleware/middleware_debug');
const debugPrinter = require('../utils/debug_printer');

const routerListings = express.Router();

routerListings.use(middlewareDebug.preMiddlewareDebugFullWithMessage('Route: listings'));

routerListings.get(
    '/:user_id',
    listingController.getListings,
);

module.exports = routerListings;
