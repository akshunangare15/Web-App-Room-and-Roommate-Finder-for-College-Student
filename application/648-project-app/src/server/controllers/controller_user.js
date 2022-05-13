/*
This file handles anything related to a user related interactions to the server

 */
const { Op } = require('sequelize');

// const { error } = require('webpack-cli/lib/utils/logger');

const to = require('await-to-js').default;
const engineUser = require('./engine_user');
const User = require('../model/User');
const User_Information = require('../model/User_Information');

const handlerAWSS3Bucket = require('./handler_aws_s3_bucket');
const handlerFile = require('./handler_file');
const handlerPassword = require('./handler_password');

const engineUserInformation = require('./engine_user_information');
const engineListing = require('./engine_listing');

const debugPrinter = require('../utils/debug_printer');
const handlerSequelize = require('./handler_sequelize');

User.hasOne(User_Information, { foreignKey: 'user_id' });

async function logOut(req, res, next) {
    // Get username (It will not exist in the session once you logout)
    const { username } = req.user;

    // Will log out user (this functionality is handled by the passport package)
    req.logOut();

    // Remove the session of the user
    req.session.destroy();

    // Clear the users cookies
    res
        .status(200)
        .clearCookie('connect.sid')
        .json({
            status: 'success',
            message: `${username} has logged out`,
        });
}

const controllerUser = {};

/**
 * Generic Search
 *
 * Notes:
 *      Search with what is in the search bar
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
controllerUser.basicSearch = async (req, res, next) => {
    // Search key by user
    const searchKey = req.query.key;

    // If no searchKey was given
    if (searchKey === undefined) {
        res.status(400)
            .send('Invalid search Use format: api/user/search?key=');
    } else if (searchKey === '') { // If searchKey is empty
        try {
            const allUsers = await engineUser.userSearch({}, {});
            if (allUsers && allUsers.length) {
                // console.log(allUsers);
                res.status(200)
                    .send({
                        message: `${allUsers.length} results(s) found`,
                        results: allUsers,
                    });
            } else {
                res.send({
                    message: 'No Results were found for your search but nothing changes',
                    results: allUsers,
                });
            }
        } catch (error) {
            console.log('ERROR IN controllerUser.basicSearch searchKey is empty'); // FIXME: Crude
            console.log(error);
            res.json({ message: 'Failure on our end, ask joseph about it' });
        }
    } else {
        // If searchKey has anything assuming that the searchKey is NOT empty

        // Query Specific user columns
        const userFilter = await handlerSequelize.getFilter(searchKey, handlerSequelize.USER_COLUMNS);

        try {
            // Get results from DB
            const results = await engineUser.userSearch(userFilter, {});

            // If results
            if (results && results.length) {
                res.status(200)
                    .send({
                        message: `${results.length} results(s) found`,
                        results,
                    });
            } else {
                // If no results

                res.send({
                    message: 'No Results were found for your search but nothing changes',
                    results,
                });
            }
        } catch (error) {
            next(error);
        }
    }
};

/**
 * Get users based on req.query
 *
 * Notes:
 *      Search based on filters
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
controllerUser.advancedSearch = async (req, res, next) => {
    const {
        ethnicity,
        gender,
        pets,
        smoking,
    } = req.query;

    // Creating the filter
    // TODO - make a universal way to set it // JOSEPH WILL DO THIS
    const userInfoFilterArray = [];

    if (ethnicity !== '') {
        userInfoFilterArray.push({
            ethnicity,
        });
    }

    if (gender === 'male' || gender === 'female') {
        userInfoFilterArray.push({
            gender,
        });
    }

    if (parseInt(pets, 10) === 1 || parseInt(pets, 10) === 0) {
        userInfoFilterArray.push({
            pets,
        });
    }

    if (parseInt(smoking, 10) === 1 || parseInt(smoking, 10) === 0) {
        userInfoFilterArray.push({
            smoking,
        });
    }
    debugPrinter.printBackendBlue(userInfoFilterArray);

    const userInfoFilter = {
        [Op.and]: userInfoFilterArray,
    };

    try {
        const results = await engineUser.userSearch({}, userInfoFilter);

        // If search results exists
        if (results && results.length) {
            res.status(200)
                .send({
                    message: `${results.length} results(s) found`,
                    results,
                });
        } else {
            res.send({
                message: 'No Results were found for your search but nothing changes',
                results,
            });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Signup for user
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
controllerUser.signup = async (req, res, next) => {
    const {
        username,
        password,
        // password_repeat, // Used in validation middleware
        firstname: firstName,
        lastname: lastName,
        phone,
        email,
        // profile_url: profileURL,
        // biography,
        // age,
        // smoking,
        // gender,
        // looking_for_housing: lookingForHousing,
        // offering_housing: offeringHousing,
        // pets,
        // ethnicity,
        tos, // TOS confirmation
    } = req.body;

    if (await engineUser.checkIfUsernameExists(username)) {
        // If username already exists in the DB
        res.json({
            status: 'failed',
            message: 'Username already exists',
        });
    } else if (await engineUser.checkIfEmailExists(email)) {
        // If email already exists in the DB
        res.json({
            status: 'failed',
            message: 'Email already exists',
        });
    } else {
        // Create new user based on info given
        try {
            const passwordHashed = await handlerPassword.hash(password);

            // Create new user
            const newUser = await engineUser.createNewUser(
                username,
                passwordHashed,
                firstName,
                lastName,
                phone,
                email,
            );

            if (process.env.NODE_ENV === 'development') {
                debugPrinter.printBackendBlue('newUser');
                console.log(newUser);
                debugPrinter.printBackendBlue('newUser.user_id');
                console.log(newUser.user_id);
            }

            // Create corresponding user information for the new user
            const newUserInformation = await engineUserInformation.createNewUserInformationById(
                newUser.user_id,
            );

            if (process.env.NODE_ENV === 'development') {
                debugPrinter.printBackendBlue('newUserInformation');
                console.log(newUserInformation);
            }

            res.json({
                status: 'success',
                message: `User ${newUser.username} created Successfully`,
            });
        } catch (error) {
            next(error);
        }
    }
};

/**
 * Login user based on the passport package
 *
 * Notes:
 *      *** The actual login of the user is handled by the middleware passport.authenticate('local')
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
controllerUser.login = async (req, res, next) => {
    /*
    The functionality of this function has been moved to middleware_passport.js to allow for
    different strategies for logging in to be supported.
    This function now has no purpose and will never be called as middleware_passport.js will call res
    meaning any next() to this function is not possible.
    Therefore, anything in this function should not work.
     */

    console.log('NO ONE WILL SEE THIS MESSAGE.');
};

/**
 * Log out user based on the passport package
 *
 * Reference:
 *      Log Out
 *          Reference:
 *              http://www.passportjs.org/docs/logout/
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
controllerUser.logout = async (req, res, next) => {
    // if (process.env.NODE_ENV === 'development') {
    //     debugPrinter.printMiddleware('Logout');
    //     debugPrinter.printFunction(
    //         `${req.route.stack[0].method}: ${req.route.path}`,
    //     );
    // }
    try {
        // Log out user
        await logOut(req, res, next);
    } catch (error) {
        next(error);
    }
};

/*
JSON (DONT USE THIS FORMAT, USE FORM INSTEAD)
{
    "firstname": "bob",
    "lastname": "dude",
    "email": "j@gmail.com",
    "smoking":"1",
    "gender":"",
    "looking_for_housing": "",
    "offering_housing": "",
    "pets":"",
    "ethnicity": ""

}

FORM (YOU WANT TO USE THIS FORMAT)
    file = WHATEVER YOUR FILE IS THAT YOU UPLOADED
    firstname =  'bob'
    lastname =  'dude'
    email =  'j@gmail.com'
    smoking = '1'
    gender = '1'
    looking_for_housing = '1'
    offering_housing = '1'
    pet = '1'
    ethnicity = Asian

 */

/**
 * Update the user and user_information table
 *
 * WARNING:
 *      ASSUMES THAT VALIDATION HAS WORKED IN TERMS OF DEALING WITH UNNECESSARY req.body INPUTS
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
controllerUser.update = async (req, res, next) => {
    const {
        firstname,
        lastname,
        email,
        smoking,
        gender,
        looking_for_housing: lookingForHousing,
        offering_housing: offeringHousing,
        pets,
        ethnicity,
    } = req.body;

    // Get the file given in the request
    const { file } = req;

    const userId = req.user.user_id;

    let profileURL = req.user.profile_url;

    try {
        // If the user uploaded a file
        if (file) {
            // If the user has a profile image in the S3 bucket
            if (await handlerAWSS3Bucket.checkIfFileExistsAsync(req.user.profile_url)) { // TODO Check if this is clean
                // Delete file from AWS S3 Bucket
                const resultDeleted = await handlerAWSS3Bucket.deleteFileByURLAsync(
                    req.user.profile_url,
                );
            }

            // Upload file to S3 bucket
            profileURL = await handlerAWSS3Bucket.uploadFileAndGetURL(file);

            // Delete the uploaded file locally
            await handlerFile.unlinkFileAsync(file.path);
        }

        // Create an object that contains key value pairs that will update the user's row
        const dbKeyValuePairsToBeUpdated = {};

        // Compare current profile_url to new profileURL (*** Note that everytime you upload an image, you get a new URL)
        if (req.user.profile_url !== profileURL) {
            dbKeyValuePairsToBeUpdated.profile_url = profileURL;
        }

        /*
        Loop over the entries in req.body and compare the key value pairs to their respective version
        from req.user for any changes. If there are no changes then do not add that new key value pair to
        dbKeyValuePairsToBeUpdated. If there are changes, then add the key value pair to
        dbKeyValuePairsToBeUpdated.

        Notes:
            Validation must have happened prior to this loop as it is dependent on valid key and valid value pairs

         */
        Object.entries(req.body)
            .forEach(([key, value]) => {
                // If what's in req.user is different and not empty
                if (value !== req.user[key] && value !== '') {
                    dbKeyValuePairsToBeUpdated[key] = value;
                }
                // debugPrinter.printBackendGreen(`${key} ${value} | $ ${key} ${req.user[key]}`);
            });

        // debugPrinter.printBackendRed(dbKeyValuePairsToBeUpdated);

        // Returns a promise of [0] or [1]
        const promiseUserUpdate = engineUser.updateUserImplicit(
            userId,
            dbKeyValuePairsToBeUpdated,
        );

        // Returns a promise of [0] or [1]
        const promiseUserInformationUpdate = engineUserInformation.updateUserInformationByIdImplicit(
            userId,
            dbKeyValuePairsToBeUpdated,
        );

        const [userUpdated, userInformationUpdated] = await Promise.all([promiseUserUpdate, promiseUserInformationUpdate]);

        // Get user information (Data should be updated)
        const results = await engineUser.getUserAndUserInformationByUserId(userId);

        res.json({
            message: `User id ${userId} is updated.`,
            results,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user information
 *
 * Notes:
 *      Gets a lot of user information and returns it
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
controllerUser.getUserAndUserInformationByUserId = async (req, res, next) => {
    const { user_id: userId } = req.query;

    const [error, results] = await to(engineUser.getUserAndUserInformationByUserId(userId));

    if (error) {
        next(error);
    }

    if (results) {
        res.send({
            message: `User with user_id ${userId} found`,
            results,
        });
    } else {
        res.send({
            message: 'No Results were found for your search but nothing changes',
            results,
        });
    }
};

/**
 * Will delete user
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
controllerUser.delete = async (req, res, next) => {
    try {
        // Get username and profile_url now because when you log out, you will not have these attributes
        const {
            user_id: userId,
            username,
            profile_url: profileUrl,
        } = req.user;

        const listings = await engineListing.getListingsByUserId(req.user.user_id);

        // Delete all listings
        for await (const listing of listings) {
            const listingId = listing.listing_id;
            const result = await engineListing.deleteListingByListingId(listingId);
        }

        // If the user has a profile image in the S3 bucket
        if (await handlerAWSS3Bucket.checkIfFileExistsAsync(profileUrl)) { // TODO Check if this is clean
            // Delete file from AWS S3 Bucket
            const resultDeleted = await handlerAWSS3Bucket.deleteFileByURLAsync(
                profileUrl,
            );
        }

        // Will log out user (this functionality is handled by the passport package)
        req.logOut();

        // Remove the session of the user
        req.session.destroy();

        // Clear the users cookies
        res
            .status(200)
            .clearCookie('connect.sid')
            .json({
                status: 'success',
                message: `${username} has been deleted`,
            });

        // Delete user profile
        engineUser.deleteUserById(userId);
    } catch (error) {
        next(error);
    }
};

module.exports = controllerUser;
