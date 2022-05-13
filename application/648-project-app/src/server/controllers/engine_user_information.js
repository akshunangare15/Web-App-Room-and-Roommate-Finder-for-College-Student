const debugPrinter = require('../utils/debug_printer');
const User = require('../model/User');
const User_Information = require('../model/User_Information');
const wrapper = require('../utils/wrapper');

const engineUserInformation = {};

/**
 * Create a new user information row given key value pairs
 *
 * @param userId
 * @param profileURL
 * @param biography
 * @param age
 * @param smoking
 * @param gender
 * @param lookingForHousing
 * @param offeringHousing
 * @param pets
 * @param ethnicity
 * @returns {Promise<*>}
 */
async function createNewUserInformationById(userId, profileURL, biography, age, smoking, gender, lookingForHousing, offeringHousing, pets, ethnicity) {
    const userInformationNew = User_Information.create(
        {
            user_id: userId,
            profile_url: profileURL,
            biography,
            age,
            smoking,
            gender,
            looking_for_housing: lookingForHousing,
            offering_housing: offeringHousing,
            pets,
            ethnicity,
        },
        // No options can be given
    );
    return userInformationNew.then((results) => results.get({ plain: true })); // This works
}

engineUserInformation.createNewUserInformationById = createNewUserInformationById;

// engineUserInformation.createNewUserInformationById = wrapper.wrapperForNoTryCatchAsyncFunction(createNewUserInformationById);

/*
// newKeyValuePairs format
{
    user_id: null,
    profile_url: null,
    biography: null,
    age: null,
    smoking: null,
    gender: null,
    looking_for_housing: null,
    offering_housing: null,
    pets: null,
    ethnicity: null,
}

 */
/**
 * Create a new user information row given key value pairs (implicit version)
 *
 * @param newKeyValuePairs
 * @returns {Promise<*>}
 */
async function createNewUserInformationByIdImplicit(newKeyValuePairs) {
    const userInformationNew = User_Information.create({ newKeyValuePairs });

    return userInformationNew.then((results) => results.get({ plain: true }));
}

engineUserInformation.createNewUserInformationByIdImplicit = createNewUserInformationByIdImplicit;

// engineUserInformation.createNewUserInformationByIdImplicit = wrapper.wrapperForNoTryCatchAsyncFunction(createNewUserInformationByIdImplicit);

async function updateUserInformationById(userId, smoking, gender, pets, ethnicity) {
    const result = User_Information.update(
        {
            smoking,
            gender,
            pets,
            ethnicity,
        },
        {
            // raw does not work here
            where:
                {
                    user_id: userId,
                },
            // attributes do not work here

        },
    );

    return result;
}

engineUserInformation.updateUserInformationById = updateUserInformationById;

/**
 * Update user information given
 * @param userId
 * @param newKeyValuePairs
 * @returns {Promise<*>}
 */
async function updateUserInformationByIdImplicit(userId, newKeyValuePairs) {
    const result = User_Information.update(
        newKeyValuePairs,
        {
            // raw does not work here
            where:
                {
                    user_id: userId,
                },
            // attributes do not work here
        },
    );

    return result;
}

engineUserInformation.updateUserInformationByIdImplicit = updateUserInformationByIdImplicit;

// engineUserInformation.updateUserInformationByIdImplicit = wrapper.wrapperForNoTryCatchAsyncFunction(updateUserInformationByIdImplicit);

module.exports = engineUserInformation;
