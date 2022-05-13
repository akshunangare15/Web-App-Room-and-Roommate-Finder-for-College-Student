const { Op } = require('sequelize');
const User = require('../model/User');

const to = require('await-to-js').default;

const engineListing = require('./engine_listing');

const Listing = require('../model/Listing');
const Listing_Information = require('../model/Listing_Information');

const engineListingInformation = require('./engine_listing_information');
const engineImage = require('./engine_images');

const handlerAWSS3Bucket = require('./handler_aws_s3_bucket');
const handlerFile = require('./handler_file');
const handlerWithAWSS3BucketModelImage = require('./handler_aws_s3_bucket_and_model_image');

const debugPrinter = require('../utils/debug_printer');
const handlerSequelize = require('./handler_sequelize');

User.hasMany(Listing, { foreignKey: 'user_id' });
Listing.hasOne(Listing_Information, { foreignKey: 'listing_id' });

// function getListingFilter(stringGiven) {
//     let listingFilter;
//
//     const stringGivenTemp = stringGiven.toString();
//
//     // console.log(`Input of listing : ${input}`);
//
//     if (!Number.isNaN(parseInt(stringGivenTemp, 10))) {
//         // If "int" format given
//         listingFilter = {
//             zip: stringGivenTemp,
//         };
//     } else {
//         debugPrinter.printBackendMagenta(input.split(',')[0]);
//         // If "city, state" format given
//         const city = input.split(',')[0].trim();
//
//         debugPrinter.printBackendGreen(input.split(',')[1]);
//
//         const state = input.split(',')[1].trim();
//
//         listingFilter = {
//             city,
//             state,
//         };
//     }
//
//
//
//
//
//     return listingFilter;
// }

const controllerListing = {};

/**
 * Get Listing given req.query.key
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
controllerListing.getListingByLocation = async (req, res, next) => {
    // TODO frontend set format validation before hitting

    const searchKey = req.query.key;

    // console.log('run here!');
    // console.log(searchKey);

    const listingFilter = await handlerSequelize.getFilter(searchKey, handlerSequelize.LISTING_COLUMNS);

    try {
        const results = await engineListing.searchListing(listingFilter, {
            /* empty listingInfoFilter */
        });

        res.status(200)
            .send({
                message: `${results.length} results(s) found`,
                results,
            });
    } catch (error) {
        next(error);
    }
};

/**
 * Get listings based on req.query
 *
 * Notes:
 *      Search based on filters
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
controllerListing.advancedSearch = async (req, res, next) => {
    const {
        housing_type: housingType,
        max_rent: maxRent,
        custom,
    } = req.query;

    debugPrinter.printBackendMagenta(req.query);

    const listingFilter = await handlerSequelize.getFilter(custom, handlerSequelize.LISTING_COLUMNS);

    const listingInfoFilterArray = [];

    if (housingType && housingType !== '') {
        listingInfoFilterArray.push({
            housing_type: housingType,
        });
    }

    if (maxRent && maxRent !== '') {
        listingInfoFilterArray.push({
            monthly_rent: {
                [Op.lte]: +maxRent,
            },
        });
    }

    const listingInfoFilter = { [Op.and]: listingInfoFilterArray };

    try {
        const results = await engineListing.searchListing(
            listingFilter,
            listingInfoFilter,
        );

        res.status(200)
            .send({
                message: `${results.length} results(s) found`,
                results,
            });
    } catch (error) {
        next(error);
    }
};

const SF_BAY_AREA_COUNTY_LISTING = [
    'Alameda',
    'Contra Costa',
    'Marin',
    'Napa',
    'San Francisco',
    'San Mateo',
    'Santa Clara',
    'Solano',
    'Sonoma',
];

// get Initial Listing for bay area (9 counties)
controllerListing.getSFBayAreaListing = async (req, res, next) => {
    // const filterListArray = SF_BAY_AREA_COUNTY_LISTING.map((county) => ({
    //     city: county,
    //     state: 'California',
    // }));
    //
    // const listingFilter = { [Op.or]: filterListArray };

    try {
        const results = await engineListing.searchListing({}, {});

        res.status(200)
            .send({
                message: `${results.length} results(s) found`,
                results,
            });
    } catch (error) {
        next(error);
    }
};

controllerListing.getListing = async (req, res, next) => {
    const listingId = req.params.listing_id;

    try {
        debugPrinter.printBackendMagenta(listingId);
        const listing = await engineListing.getListingByListingId(listingId);
        debugPrinter.printBackendMagenta(listing);

        if (listing) {
            res.status(200)
                .send({
                    message: `Listing id ${listingId} found.`,
                    listing,
                });
        } else {
            res.status(200)
                .send({
                    message: `Listing id ${listingId} does not exist.`,
                });
        }
    } catch (error) {
        next(error);
    }
};

controllerListing.getListings = async (req, res, next) => {
    const userId = req.params.user_id;

    try {
        const listings = await engineListing.getListingsByUserId(userId);

        res.status(200)
            .send({
                message: `${listings.length} results(s) found`,
                listings,
            });
    } catch (error) {
        next(error);
    }
};

// TODO CLEAN UP
// TODO USER DYNAMIC req.body or Explicit?
controllerListing.addListing = async (req, res, next) => {
    const {
        address,
        city,
        state,
        zip,
        rooms,
        max_capacity: maxCapacity,
        description,
        monthly_rent: monthlyRent,
        housing_type: housingType,
    } = req.body;

    const userId = req.user.user_id;

    const { files } = req; // The files given in the request

    const listingFull = {};

    try {
        // Create listing
        const resultsListing = await engineListing.addListing(
            +userId,
            address,
            city,
            state,
            zip,
            +rooms,
            +maxCapacity,
        );

        Object.assign(listingFull, resultsListing);

        debugPrinter.printBackendGreen(resultsListing);

        // If listing was made
        if (resultsListing) {
            const listingId = resultsListing.listing_id;

            // Create listing_information
            const resultListingInformation = await engineListingInformation.addListingInformation(
                listingId,
                description,
                +monthlyRent,
                housingType,
            );

            Object.assign(listingFull, resultListingInformation);

            // If user uploaded images
            if (files && files.length) {
                // Delete images for the given listingId (This function can throw)
                const imagesNotDeletedFromModel = await handlerWithAWSS3BucketModelImage.deleteImagesFromAWSS3BucketAndModelByListingId(
                    resultsListing.listing_id,
                );

                // Error when deleting images from AWS S3 Bucket or DB SQL Model image
                if (imagesNotDeletedFromModel && imagesNotDeletedFromModel.length !== 0) {
                    throw new Error(
                        JSON.stringify({ images_not_deleted: imagesNotDeletedFromModel }),
                    );
                }

                listingFull.images = [];

                // Async upload file
                for await (const [index, element] of Object.entries(files)) {
                    // TODO MAKE DELETE IMAGE FROM S3 A ROUTE (GET LISTING ID AND IMAGE ORDER (INT) AND REMOVE FROM DB AND S3)

                    const file = element;

                    debugPrinter.printBackendRed(file);

                    // Upload file to S3 bucket
                    const imageURL = await handlerAWSS3Bucket.uploadFileAndGetURL(file);

                    debugPrinter.printBackendMagenta(imageURL);

                    // Delete the file locally
                    await handlerFile.unlinkFileAsync(file.path);

                    // debugPrinter.printBackendBlue(r);

                    const resultImage = await engineImage.addImage(
                        listingId,
                        imageURL,
                        index + 1,
                    );

                    listingFull.images.push(resultImage);

                    debugPrinter.printBackendMagenta(resultImage);

                    if (!resultImage) {
                        // TODO CLEAN UP
                        throw new Error('Error during async upload in controllerListing.addListing');
                    }
                }
            }
        }

        res.status(200)
            .json({
                status: 'success',
                message: `Listing id ${resultsListing.listing_id} is created.`,
                results: listingFull,
            });
    } catch (error) {
        next(error);
    }
};

controllerListing.updateListing = async (req, res, next) => {
    const {
        listing_id: listingId,
        address,
        city,
        state,
        zip,
        rooms,
        max_capacity: maxCapacity,
        description,
        monthly_rent: monthlyRent,
        housing_type: housingType,
    } = req.body;

    const userId = req.user.user_id;

    const { files } = req; // The files given in the request

    const listingFull = {};

    // TODO CHECK IF YOU OWN IT, TEST THIS OUT AND CLEAN

    try {
        // Check if current user owns the listing

        if (await engineListing.checkIfListingIdExists(listingId)) {
            if (
                await engineListing.checkIfUserOwnsListing(req.user.user_id, listingId)
            ) {
                const listingOriginal = await engineListing.getListingByListingId(listingId);

                // Create an object that contains key value pairs that will update the listing's row and listing_information_row
                const dbKeyValuePairsToBeUpdated = {};

                Object.entries(req.body)
                    .forEach(([key, value]) => {
                        // If what's in req.user is different and not empty
                        if (value !== listingOriginal[key] && value !== '') {
                            dbKeyValuePairsToBeUpdated[key] = value;
                        }
                        // debugPrinter.printBackendGreen(`${key} ${value} | $ ${key} ${listingOriginal[key]}`);
                    });

                // debugPrinter.printBackendRed(dbKeyValuePairsToBeUpdated);

                // Update listing
                const resultsListing = await engineListing.updateListingImplicit(
                    listingId,
                    dbKeyValuePairsToBeUpdated,
                );
                // debugPrinter.printBackendGreen(resultsListing);

                // Update listing_information
                const resultListingInformation = await engineListingInformation.updateListingInformationImplicit(
                    listingId,
                    dbKeyValuePairsToBeUpdated,
                );
                // debugPrinter.printBackendGreen(resultListingInformation);

                // If user uploaded images
                if (files && files.length) {
                    // TODO THIS IS DUP CODE WITH ADDING
                    // Delete images for the given listingId (This function can throw)
                    const imagesNotDeletedFromModel = await handlerWithAWSS3BucketModelImage.deleteImagesFromAWSS3BucketAndModelByListingId(
                        listingId,
                    );

                    // Error when deleting images from AWS S3 Bucket or DB SQL Model image
                    if (imagesNotDeletedFromModel && imagesNotDeletedFromModel.length !== 0) {
                        throw new Error(
                            JSON.stringify({ images_not_deleted: imagesNotDeletedFromModel }),
                        );
                    }
                    // debugPrinter.printBackendMagenta('files');
                    // debugPrinter.printBackendGreen(files);

                    listingFull.images = [];

                    // Async upload file
                    for await (const [index, element] of Object.entries(files)) {
                        // TODO MAKE DELETE IMAGE FROM S3 A ROUTE (GET LISTING ID AND IMAGE ORDER (INT) AND REMOVE FROM DB AND S3)

                        const file = element;

                        debugPrinter.printBackendRed(file);

                        // Upload file to S3 bucket
                        const imageURL = await handlerAWSS3Bucket.uploadFileAndGetURL(file);

                        debugPrinter.printBackendMagenta(imageURL);

                        // Delete the file locally
                        await handlerFile.unlinkFileAsync(file.path);

                        // debugPrinter.printBackendBlue(r);

                        const resultImage = await engineImage.addImage(
                            listingId,
                            imageURL,
                            index + 1,
                        );

                        listingFull.images.push(resultImage);

                        debugPrinter.printBackendMagenta(resultImage);

                        if (!resultImage) {
                            // TODO CLEAN UP
                            throw new Error('Error during async upload in controllerListing.updateListing');
                        }
                    }
                }

                const results = await engineListing.getListingByListingId(listingId);

                res.status(200)
                    .json({
                        status: 'success',
                        message: `Listing id ${listingId} is updated.`,
                        results,
                    });
            } else {
                // If user does not own listing
                res.status(200)
                    .json({
                        status: 'failed',
                        message: `You do not own listing id ${listingId}.`,
                    });
            }
        } else {
            res.status(200)
                .json({
                    status: 'failed',
                    message: `Listing id ${listingId} does not exists.`,
                });
        }
    } catch (error) {
        next(error);
    }
};

controllerListing.deleteListing = async (req, res, next) => {
    const listingId = req.params.listing_id;

    try {
        // Check if current user owns the listing

        if (await engineListing.checkIfListingIdExists(listingId)) {
            if (
                await engineListing.checkIfUserOwnsListing(req.user.user_id, listingId)
            ) {
                const result = await engineListing.deleteListingByListingId(listingId);
                if (result) {
                    res.status(200)
                        .json({
                            status: 'success',
                            message: `Listing id ${listingId} is deleted.`,
                        });
                }
            } else {
                // If user does not own listing
                res.status(200)
                    .json({
                        status: 'failed',
                        message: `You do not own listing id ${listingId}.`,
                    });
            }
        } else {
            res.status(200)
                .json({
                    status: 'failed',
                    message: `Listing id ${listingId} does not exists.`,
                });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = controllerListing;

// TODO FIX EVERYTHING HERE
