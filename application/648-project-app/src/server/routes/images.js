const express = require('express');
const s3Handler = require('../controllers/handler_aws_s3_bucket');
const debugPrinter = require('../utils/debug_printer');
const middlewareDebug = require('../middleware/middleware_debug');
const controllerImages = require('../controllers/controller_images');
const engineImages = require('../controllers/engine_images');

const routerImages = express.Router();

routerImages.use(
    middlewareDebug.preMiddlewareDebugFullWithMessage('Route: images'),
);

/*
Get images by listing_id

Example:
    http://localhost:3000/api/images/images?listing_id={listing_id}

    The return is an object { images: array_of_images[]}

    images: [
      {
        image_id: 1,
        listing_id: 22,
        image_url : "ascasxasx/asas.jpg",
        image_order: 2
      },
      ...
    ]
 */
routerImages.get(
    '/images',
    controllerImages.getImageUrls,
);

/*
Get Image by image url

Example:
    http://localhost:3000/api/images/test_image.jpg

 */
routerImages.get(
    '/:key',
    middlewareDebug.preMiddlewareDebugSimpleWithMessage('Get Image by key called!'),
    controllerImages.getImageByKey,
);

module.exports = routerImages;
