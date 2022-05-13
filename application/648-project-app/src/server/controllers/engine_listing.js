const { Op } = require('sequelize');

const User = require('../model/User');
const User_Information = require('../model/User_Information');
const Listing = require('../model/Listing');
const Listing_Information = require('../model/Listing_Information');
const Image = require('../model/Image');
const handlerWithAWSS3BucketModelImage = require('./handler_aws_s3_bucket_and_model_image');

const debugPrinter = require('../utils/debug_printer');
const wrapper = require('../utils/wrapper');
const engineImages = require('./engine_images');

const engineListing = {};

User.hasMany(Listing, { foreignKey: 'user_id' });
Listing.hasOne(Listing_Information, { foreignKey: 'listing_id' });
Listing.hasMany(Image, { foreignKey: 'listing_id' });

/**
 * Search for listing given filters to search by
 *2222
 * @param listingFilter
 * @param listingInfoFilter
 * @returns {Promise<*|null>}
 */
async function searchListing(listingFilter, listingInfoFilter) {
    const listings = Listing.findAll({
        raw: true,
        where: listingFilter,
        attributes: [
            'listing_id',
            'user_id',
            'address',
            'city',
            'state',
            'zip',
            'rooms',
            'max_capacity',
            'listing_information.description',
            'listing_information.housing_type',
            'listing_information.monthly_rent',
        ],
        include: {
            model: Listing_Information,
            attributes: [],
            where: listingInfoFilter,
            // required: true, // (true is Inner Join, False (Default) is Left join. You want a left join is foreign keys are missing due to improper DB transactions)
        },
    });

    return listings;
}

engineListing.searchListing = searchListing;

// engineListing.searchListing = wrapper.wrapperForNoTryCatchAsyncFunction(searchListing);

// engineListing.getImagesByListingId = wrapper.wrapperForNoTryCatchAsyncFunction(getImagesByListingId);

/**
 * Add listing to DB given parameters and get the result of the database call
 *
 * @param userId
 * @param address
 * @param city
 * @param state
 * @param zip
 * @param rooms
 * @param maxCapacity
 * @returns {Promise<*>}
 */
async function addListing(
    userId,
    address,
    city,
    state,
    zip,
    rooms,
    maxCapacity,
) {
    const listingNew = Listing.create({
        user_id: userId,
        address,
        city,
        state,
        zip,
        rooms,
        max_capacity: maxCapacity,
    });

    return listingNew.then((results) => results.get({ plain: true })); // Will make the output like raw: true
}

engineListing.addListing = addListing;

// engineListing.addListing = wrapper.wrapperForNoTryCatchAsyncFunction(addListing);

async function updateListing(
    listingId,
    // userId,
    address,
    city,
    state,
    zip,
    rooms,
    maxCapacity,
) {
    const listing = Listing.update(
        {
            address,
            city,
            state,
            zip,
            rooms,
            max_capacity: maxCapacity,
        },
        {
            // raw does not work here
            where: {
                listing_id: listingId,
                // user_id: userId,
            },
            // attributes do not work here
        },
    );
    return listing;
}

engineListing.updateListing = updateListing;

async function updateListingImplicit(listingId, newKeyValuePairs) {
    const listing = Listing.update(
        newKeyValuePairs,
        {
        // raw does not work here
            where: {
                listing_id: listingId,
            },
        // attributes do not work here
        },
    );
    return listing;
}

engineListing.updateListingImplicit = updateListingImplicit;

// engineListing.updateListingImplicit = wrapper.wrapperForNoTryCatchAsyncFunction(updateListingImplicit);

async function deleteListingByListingId(listingId) {
    // Delete images by listingId from AWS S3 Bucket and Sequelize SQL DB Model Listing, Listing_Image, and Image
    const imagesNotDeletedFromModel = await handlerWithAWSS3BucketModelImage.deleteImagesFromAWSS3BucketAndModelByListingId(
        listingId,
    );

    // Throw if images did not delete
    if (imagesNotDeletedFromModel && imagesNotDeletedFromModel.length > 0) {
        throw new Error(
            JSON.stringify({ images_not_deleted: imagesNotDeletedFromModel }),
        );
    }

    // Delete listing from DB SQL Model Listing
    const result = await Listing.destroy({
        // raw does not work here
        where: {
            listing_id: listingId,
        },
    });

    return !!result;
}

engineListing.deleteListingByListingId = deleteListingByListingId;

// engineListing.deleteListingByListingId = wrapper.wrapperForNoTryCatchAsyncFunction(deleteListingByListingId);

async function getListingsByUserId(userId) {
    const listings = User.findAll({
        raw: true, // Required or will not work,
        // as: 'user', // Does nothing
        where: { user_id: userId },
        attributes: [
            'listings.listing_id',
            'listings.user_id',
            'listings.address',
            'listings.city',
            'listings.state',
            'listings.zip',
            'listings.rooms',
            'listings.max_capacity',
            // 'listings.listing_information.listing_id',
            'listings.listing_information.description',
            'listings.listing_information.housing_type',
            'listings.listing_information.monthly_rent',
        ],
        include: {
            // raw: true, // Does nothing
            // as: 'listing', // Does not work
            model: Listing,
            attributes: [], // Needs to be [] to prevent listings.
            include: [
                {
                    // raw: true, // Does nothing
                    model: Listing_Information,
                    attributes: [], // Needs to be [] to prevent listings.listing_information.
                    // required: true, // required: true, // (true is Inner Join, False (Default) is Left join. You want a left join is foreign keys are missing due to improper DB transactions)
                },
            ],
            // required: true, // required: true, // (true is Inner Join, False (Default) is Left join. You want a left join is foreign keys are missing due to improper DB transactions)
        },
        // required: true,
    })
        .then(async (listingsTemp) => {
            debugPrinter.printBackendMagenta(listingsTemp);

            // Loop over listings and append its images
            for await (const listing of listingsTemp) {
                // Get images based on listing
                const images = await engineImages.getImagesByListingId(listing.listing_id);

                listing.images = images;
            }

            return listingsTemp;
        });
    return listings;
}

engineListing.getListingsByUserId = getListingsByUserId;

async function getListingByListingId(ListingId) {
    const listing = await Listing.findOne(
        {
            raw: true, // Makes the output easy to understand
            where:
                {
                    listing_id: ListingId,
                },
            attributes: [
                'listing_id',
                'user_id',
                'address',
                'city',
                'state',
                'zip',
                'rooms',
                'max_capacity',
                // 'listing_information.listing_id',
                'listing_information.description',
                'listing_information.housing_type',
                'listing_information.monthly_rent',
            ],
            include: {
                raw: true,
                model: Listing_Information,
                attributes: [], // Needs to be [] to prevent listing_information.
                // required: true, // required: true, // (true is Inner Join, False (Default) is Left join. You want a left join is foreign keys are missing due to improper DB transactions)
            },
        },
    );

    if (listing) {
        // Get images based on the listing
        const images = await engineImages.getImagesByListingId(listing.listing_id);

        listing.images = images;
    }

    return listing;
}

engineListing.getListingByListingId = getListingByListingId;

async function checkIfUserOwnsListing(userId, listingId) {
    // debugPrinter.printBackendBlue(userId);
    // debugPrinter.printBackendBlue(listingId);

    const listing = await Listing.findOne(
        {
            raw: true, // Makes the output easy to understand
            where:
                {
                    user_id: userId,
                    listing_id: listingId,

                },
            // attributes: [], // Uncommenting this will break this function because you didn't select any columns
        },
    );

    // debugPrinter.printBackendGreen(listing);

    return !!listing;
}

engineListing.checkIfUserOwnsListing = checkIfUserOwnsListing;

async function checkIfListingIdExists(listingId) {
    const listing = await Listing.findOne(
        {
            raw: true, // Makes the output easy to understand
            where:
                {
                    listing_id: listingId,

                },
            // attributes: [], // Uncommenting this will break this function because you didn't select any columns
        },
    );

    return !!listing;
}
engineListing.checkIfListingIdExists = checkIfListingIdExists;

module.exports = engineListing;
