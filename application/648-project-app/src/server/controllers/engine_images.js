const Image = require('../model/Image');

const wrapper = require('../utils/wrapper');

const engineImages = {};

/**
 * Add image url to DB image table
 *
 * @param listingId
 * @param imageURL
 * @param imageOrder
 * @returns {Promise<*>}
 */
async function addImage(listingId, imageURL, imageOrder) {
    const image = Image.create({
        listing_id: listingId,
        image_url: imageURL,
        image_order: imageOrder,
    });
    return image.then((results) => results.get({ plain: true }));
}

engineImages.addImage = addImage;

// engineImages.addImage = wrapper.wrapperForNoTryCatchAsyncFunction(addImage);

/**
 * Delete image from DB image table
 *
 * @param listingId
 * @param imageURL
 * @param imageOrder
 * @returns {Promise<boolean>}
 */
async function deleteImageSpecific(listingId, imageURL, imageOrder) {
    const image = await Image.destroy({
        raw: true,
        where: {
            listing_id: listingId,
            image_url: imageURL,
            image_order: imageOrder,
        },
    });
    return !!image;
}

engineImages.deleteImageSpecific = deleteImageSpecific;

/**
 * Delete image by image_id and remove it from s3
 * @param imageId
 * @returns {Promise<boolean>}
 */
async function deleteImageByImageId(imageId) {
    const image = await Image.destroy({
        raw: true,
        where: {
            image_id: imageId,
        },
    });
    return !!image;
}

engineImages.deleteImageByImageId = deleteImageByImageId;

// engineImages.deleteImageSpecific = wrapper.wrapperForNoTryCatchAsyncFunction(deleteImageSpecific);

/**
 * Get image by imageId
 *
 * @param imageId
 * @returns {Promise<*>}
 */
async function getImageByImageId(imageId) {
    const image = await Image.findOne({
        raw: true,
        where: {
            image_id: imageId,
        },
    });
    return image;
}

engineImages.getImageByImageId = getImageByImageId;

/**
 * Get images by listingId
 *
 * @param imageId
 * @returns {Promise<Array[Object]>}
 */
async function getImagesByListingId(listingID) {
    const images = await Image.findAll({
        raw: true,
        where: {
            listing_id: listingID,
        },
        order: [['image_order', 'ASC']],
    });
    return images;
}

engineImages.getImagesByListingId = getImagesByListingId;

module.exports = engineImages;
