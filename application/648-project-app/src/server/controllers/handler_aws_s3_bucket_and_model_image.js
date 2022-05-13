/*
Handle the interaction between the AWS S3 Bucket and iamge model
 */
const { default: to } = require('await-to-js').default;

const handlerAWSS3Bucket = require('./handler_aws_s3_bucket');
const engineImages = require('./engine_images');
const { mode } = require('../../../webpack.config');
const debugPrinter = require('../utils/debug_printer');

const handlerWithAWSS3BucketModelImage = {};

/**
 * Delete iamge from AWS S3 Bucket and then delete image from the DB
 *
 * Notes:
 *      This function can throw.
 *
 *
 * @param listingId
 * @param imageURL
 * @param imageOrder
 * @returns {Promise<boolean|{deleted_from_aws_s3_bucket: *, deleted_from_db_sql_images: *, image_url}>}
 */
async function deleteImageSpecificFromAWSS3BucketAndModel(
    listingId,
    imageURL,
    imageOrder,
) {
    // ***** EXPLICIT DELETE *****
    // // Delete image from AWS S3 Bucket
    // const [errorAWSS3Bucket, promiseAWSS3Bucket] = await to(handlerAWSS3Bucket.deleteFileByURLAsync(imageURL)); // This function can throw
    //
    // // AWS S3 Bucket Error
    // if (errorAWSS3Bucket) {
    //     throw errorAWSS3Bucket;
    // }
    //
    // // Delete image from the SQL DB model Image
    // const [errorSequelize, promiseDeleteImage] = await to(engineImages.deleteImageSpecific(listingId, imageURL, imageOrder));
    //
    // // Sequelize Error
    // if (errorSequelize) {
    //     throw errorSequelize;
    // }

    // ***** IMPLICIT DELETE *****
    // Promise to Delete image from AWS S3 Bucket
    const promiseAWSS3Bucket = handlerAWSS3Bucket.deleteFileByURLAsync(imageURL); // This function can throw

    // Promise to Delete image from the SQL DB model Image
    const promiseDeleteImage = engineImages.deleteImageSpecific(
        listingId,
        imageURL,
        imageOrder,
    );

    const [resultAWSS3Bucket, resultDeleteImage] = Promise.all([
        promiseAWSS3Bucket,
        promiseDeleteImage,
    ]);

    // Return if the image was deleted from both AWS S3 Bucket and DB SQL image table
    if (resultAWSS3Bucket && resultDeleteImage) {
        return true;
    }

    // Return an object showing what failed
    return {
        image_url: imageURL,
        deleted_from_aws_s3_bucket: resultAWSS3Bucket,
        deleted_from_db_sql_images: resultDeleteImage,
    };
}

handlerWithAWSS3BucketModelImage.deleteImageSpecificFromAWSS3BucketAndModel = deleteImageSpecificFromAWSS3BucketAndModel;

/**
 * Delete images from AWS S3 Bucket and DB model Image and return list of image urls not deleted
 *
 * @param listingId
 * @returns {Promise<*[]>}
 */
async function deleteImagesFromAWSS3BucketAndModelByListingId(listingId) {
    // TODO DON'T KNOW IF THIS WILL WORK BECAUSE OF THE ARRAY
    // Get images by listing_id
    const images = await engineImages.getImagesByListingId(listingId);

    debugPrinter.printError('LOOK');

    const imagesNotDeleted = [];

    // Loop and delete images from AWS S3 Bucket and DB model Image
    for await (const element of images) {
        const { image_id: imageId, image_url: imageURL } = element;

        // Promise to Delete image from AWS S3 Bucket
        const promiseAWSS3Bucket = handlerAWSS3Bucket.deleteFileByURLAsync(imageURL); // This function can throw

        // Promise to Delete image from the SQL DB model Image
        const promiseDeleteImage = engineImages.deleteImageByImageId(imageId);

        const [resultAWSS3Bucket, resultDeleteImage] = await Promise.all([
            promiseAWSS3Bucket,
            promiseDeleteImage,
        ]);

        // Add image url to array if failed to delete
        if (!resultAWSS3Bucket || !resultDeleteImage) {
            imagesNotDeleted.push({
                image_url: imageURL,
                deleted_from_aws_s3_bucket: resultAWSS3Bucket,
                deleted_from_db_sql_images: resultDeleteImage,
            });
        }
    }

    return imagesNotDeleted;
}

handlerWithAWSS3BucketModelImage.deleteImagesFromAWSS3BucketAndModelByListingId = deleteImagesFromAWSS3BucketAndModelByListingId;

module.exports = handlerWithAWSS3BucketModelImage;
