const to = require('await-to-js').default;

const s3Handler = require('./handler_aws_s3_bucket');
const engineImages = require('./engine_images');

const debugPrinter = require('../utils/debug_printer');

const controllerImages = {};

controllerImages.getImageByKey = async (req, res, next) => {
    const imageUrl = req.params.key;

    try {
        const readStream = await s3Handler.downloadFileAsync(imageUrl);

        if (readStream == null) { // File does not exist
            res.json({ message: 'Image does not exist' });
        } else { // Return image to client
            readStream.pipe(res);
        }
    } catch (error) {
        // AWS S3 bucket Error
        next(error);
    }
};

controllerImages.getImageUrls = async (req, res, next) => {
    const { listing_id: listingId } = req.query;

    try {
        const imageURLs = await engineImages.getImagesByListingId(listingId);
        res.status(200).json({
            imageURLs,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = controllerImages;
