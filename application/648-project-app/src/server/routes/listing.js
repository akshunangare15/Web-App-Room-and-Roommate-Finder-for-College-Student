const express = require('express');

const listingController = require('../controllers/controller_listing');

const middlewareFileUpload = require('../middleware/middleware_file_upload');
const middlewareAuthentication = require('../middleware/middleware_passport');
const middlewareDebug = require('../middleware/middleware_debug');
const middlewareValidation = require('../middleware/middleware_validation');

const routerListing = express.Router();

routerListing.use(
    middlewareDebug.preMiddlewareDebugFullWithMessage('Route: listing'),
);

/*
Add listing

Route:
    POST
        .../api/listing/

Format:
    FORM
        {
            "address": "string",
            "city": "string",
            "state": "string",
            "zip": "int",
            "rooms": "int/null",
            "max_capacity": "int/null",

            "description": "string/null",
            "monthly_rent": "int/null",
            "housing_type": "string/null",

            "images": ...,
        }

 */
routerListing.post(
    '/',
    middlewareAuthentication.checkAuthenticated, // Check if logged in
    middlewareFileUpload.array('images', 7), // Validate form images and assign form data to req.body
    middlewareValidation.validateListingAdd, // Validate req.body for Adding a Listing
    middlewareDebug.preMiddlewareDebugSimpleWithMessage('listingController.addListing'),
    listingController.addListing,
);

/*
Update Listing

Route:
    PUT
        .../api/listing/

Format:
    FORM
        {
            "address": "string",
            "city": "string",
            "state": "string",
            "zip": "int",
            "rooms": "int/null",
            "max_capacity": "int/null",

            "description": "string/null",
            "monthly_rent": "int/null",
            "housing_type": "string/null",

            "images": ...,
        }

 */
routerListing.put(
    '/',
    middlewareAuthentication.checkAuthenticated, // Check if logged in
    middlewareFileUpload.array('images', 7), // Validate form images and assign form data to req.body
    middlewareValidation.validateListingUpdate, // Validate req.body for Updating a Listing
    middlewareDebug.preMiddlewareDebugSimpleWithMessage('listingController.updateListing'),
    listingController.updateListing,
);

/*

Route:
    DELETE
        .../api/listing/:listing_id
 */
routerListing.delete(
    '/:listing_id',
    // middlewareAuthentication.checkAuthenticated,
    middlewareDebug.preMiddlewareDebugSimpleWithMessage('listingController.deleteListing'),
    listingController.deleteListing,
);

/*
This one is using for serach bar

Example:
    http://localhost:3000/api/listing/getall?key="city, state"
    http://localhost:3000/api/listing/getall?key=zip

    http://localhost:3000/api/listing/getall?key=94121    <== use this url to check data format in browser

 */
routerListing.get(
    '/getAll',
    listingController.getListingByLocation,
);

/*
Advanced Search

Route:
    POST
        .../api/listing/search

Example:
    use this url to check data format in browser; Query parameter location is the same as the 'key' in getAll routes
    http://localhost:3000/api/listing/search?max_rent=1200&&housing_type=condo&&location=90050

 */
routerListing.get(
    '/search',
    listingController.advancedSearch,
);

/*
Loading bayarea listing when you render the ("Find room") view
Example:
    http://localhost:3000/api/listing/initial  <== use this url to check data format in browser

 */

// TODO: MOVE TO listings
routerListing.get(
    '/initial',
    middlewareDebug.preMiddlewareDebugSimpleWithMessage('listingController.getSFBayAreaListing'),
    listingController.getSFBayAreaListing,
);

/*
Get Listing

FIXME: listingController.getListing MUST BE HERE OR ELSE!!! BECAUSE OF api/listing/:

Example:
    http://localhost:3000/api/listing/listing_id=1

 */
routerListing.get('/:listing_id',
    listingController.getListing);

module.exports = routerListing;
