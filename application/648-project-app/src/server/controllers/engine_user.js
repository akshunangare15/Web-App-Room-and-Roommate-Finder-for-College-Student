const { Op } = require('sequelize');

const User = require('../model/User');
const User_Information = require('../model/User_Information');
const Listing = require('../model/Listing');
const Listing_Information = require('../model/Listing_Information');
const Image = require('../model/Image');

const wrapper = require('../utils/wrapper');

const debugPrinter = require('../utils/debug_printer');

User.hasMany(Listing, { foreignKey: 'user_id' });
Listing.hasOne(Listing_Information, { foreignKey: 'listing_id' });
Listing.hasMany(Image, { foreignKey: 'listing_id' });

const engineUser = {};

// FORMAT
/*
user {
  dataValues: {
    user_id: 106,
    username: 'josephe',
    firstname: 'Joseph',
    lastname: 'Edradan',
    phone: '123-123-4444',
    email: 'josephedradan@mail.com',
    password: '$2b$10$eILQYvpSUHrLOeaht8hr3e9w1KprHtJatAT2LFQfethRqVuEwuaUS',
    usertype: 'user'
  },
  _previousDataValues: {
    user_id: 106,
    username: 'josephe',
    firstname: 'Joseph',
    lastname: 'Edradan',
    phone: '123-123-4444',
    email: 'josephedradan@mail.com',
    password: '$2b$10$eILQYvpSUHrLOeaht8hr3e9w1KprHtJatAT2LFQfethRqVuEwuaUS',
    usertype: 'user'
  },
  _changed: Set(0) {},
  _options: {
    isNewRecord: false,
    _schema: null,
    _schemaDelimiter: '',
    raw: true,
    attributes: [
      'user_id',   'username',
      'firstname', 'lastname',
      'phone',     'email',
      'password',  'usertype'
    ]
  },
  isNewRecord: false
}

 */
/**
 * Get user given
 *
 * @param username
 * @returns {Promise<*|null>}
 */
async function getUserByUsername(username) {
    const userByUsername = User.findOne(
        {
            raw: true,
            where:
                {
                    username,
                },
        },
    );
    return userByUsername;
}

engineUser.getUserByUsername = getUserByUsername;

// engineUser.getUserByUsername = wrapper.wrapperForNoTryCatchAsyncFunction(getUserByUsername);

/**
 * Get user and user information given username
 *
 * @param username
 * @returns {Promise<*|null>}
 */
async function getUserAndUserInformationByUsername(username) {
    const userByUsername = User.findOne(
        {
            raw: true, // Makes the output easy to understand
            where:
                {
                    username,
                },
            attributes: [
                'user_id',
                'username',
                'firstname',
                'lastname',
                'phone',
                'email',
                'user_information.profile_url',
                'user_information.biography',
                'user_information.age',
                'user_information.smoking',
                'user_information.gender',
                'user_information.looking_for_housing',
                'user_information.offering_housing',
                'user_information.pets',
                'user_information.ethnicity',

            ],
            include: [{
                model: User_Information,
                attributes: [], // Needs to be [] to prevent user_information.
                // required: true, // required: true, // (true is Inner Join, False (Default) is Left join. You want a left join is foreign keys are missing due to improper DB transactions)
            }],
        },
    );

    return userByUsername;
}

engineUser.getUserAndUserInformationByUsername = getUserAndUserInformationByUsername;

engineUser.getUserAndUserInformationByUsername = wrapper.wrapperForNoTryCatchAsyncFunction(getUserAndUserInformationByUsername);

/**
 * Get user and user information given user id
 *
 * @param userId
 * @returns {Promise<*|null>}
 */
async function getUserAndUserInformationByUserId(userId) {
    const userAndUserInformationByUserId = User.findByPk(userId, {
        raw: true, // Makes the output easy to understand
        attributes: [
            'user_id',
            'username',
            'firstname',
            'lastname',
            'phone',
            'email',
            'user_information.profile_url',
            'user_information.age',
            'user_information.smoking',
            'user_information.gender',
            'user_information.biography',
            'user_information.looking_for_housing',
            'user_information.offering_housing',
            'user_information.pets',
            'user_information.ethnicity',
        ],
        include: {
            model: User_Information,
            attributes: [], // Needs to be [] to prevent user_information.
            // required: true, // required: true, // (true is Inner Join, False (Default) is Left join. You want a left join is foreign keys are missing due to improper DB transactions)
        },
    });

    return userAndUserInformationByUserId;
}

engineUser.getUserAndUserInformationByUserId = getUserAndUserInformationByUserId;

// engineUser.getUserAndUserInformationByUserId = wrapper.wrapperForNoTryCatchAsyncFunction(getUserAndUserInformationByUserId);

/**
 * Get user given email
 *
 * @param email
 * @returns {Promise<*|null>}
 */
async function getUserByEmail(email) {
    const userByEmail = User.findOne(
        {
            raw: true,
            where:
                {
                    email,
                },
        },
    );

    return userByEmail;
}

engineUser.getUserByEmail = getUserByEmail;

// engineUser.getUserByEmail = wrapper.wrapperForNoTryCatchAsyncFunction(getUserByEmail);

/*
THE RETURN OF THE BELOW
user {
  dataValues: {
    usertype: 'user',
    user_id: 101,
    username: 'josephe',
    password: '$2b$10$WFmRSWLysurzgv1tDdxiS.Onq8o1.jXx4hj3uQudt2j6fnVGAd8sy',
    firstname: 'Joseph',
    lastname: 'Edradan',
    phone: '123-123-4444',
    email: 'josephedradan@mail.com'
  },
  _previousDataValues: {
    username: 'josephe',
    password: '$2b$10$WFmRSWLysurzgv1tDdxiS.Onq8o1.jXx4hj3uQudt2j6fnVGAd8sy',
    firstname: 'Joseph',
    lastname: 'Edradan',
    phone: '123-123-4444',
    email: 'josephedradan@mail.com',
    user_id: 101,
    usertype: 'user'
  },
  _changed: Set(0) {},
  _options: {
    isNewRecord: true,
    _schema: null,
    _schemaDelimiter: '',
    attributes: undefined,
    include: undefined,
    raw: undefined,
    silent: undefined
  },
  isNewRecord: false
}
 */

/*

// FORMAT FOR CREATING A NEW USER (ALL INPUTS ARE REQUIRED)
{
    username,
    password: passwordHashed,
    firstname: firstName,
    lastname: lastName,
    phone,
    email,
}

 */
/**
 * Create new user in DB user table implicitly
 *
 * @param newKeyValuePairs
 * @returns {Promise<*>}
 */
async function createNewUserImplicit(newKeyValuePairs) {
    const userNew = User.create(
        newKeyValuePairs,
    );

    return userNew.then((results) => results.get({ plain: true })); // Will make the output like raw: true;
}

engineUser.createNewUserImplicit = createNewUserImplicit;

// engineUser.createNewUserImplicit = wrapper.wrapperForNoTryCatchAsyncFunction(createNewUserImplicit);

/**
 * Create new user in DB user table explicitly
 *
 * @param username
 * @param password
 * @param firstName
 * @param lastName
 * @param phone
 * @param email
 * @returns {Promise<*>}
 */
async function createNewUser(username, password, firstName, lastName, phone, email) {
    const userNew = User.create(
        {
            username,
            password,
            firstname: firstName,
            lastname: lastName,
            phone,
            email,
        },
        // No options can be given
    );
    return userNew.then((results) => results.get({ plain: true })); // Will make the output like raw: true;
}

engineUser.createNewUser = createNewUser;

// engineUser.createNewUser = wrapper.wrapperForNoTryCatchAsyncFunction(createNewUser);

/**
 * Get user by user id from the DB user table
 *
 * @param userID
 * @returns {Promise<*>}
 */
async function getUserByUserId(userID) {
    const user = User.findOne(
        {
            raw: true,
            where:
                {
                    user_id: userID,
                },
        },
    );

    return user;
}

engineUser.getUserByUserId = getUserByUserId;

// engineUser.getUserByUserId = wrapper.wrapperForNoTryCatchAsyncFunction(getUserByUserId);

/**
 * Search for user in DB user table given Sequelize where object for the user and user_information
 *
 * @param userFilter
 * @param userInfoFilter
 * @returns {Promise<*>}
 */
async function userSearch(userFilter, userInfoFilter) {
    const users = User.findAll(
        {
            raw: true,
            where: userFilter,
            attributes: [
                'user_id',
                'username',
                'firstname',
                'lastname',
                'phone',
                'email',
                'user_information.profile_url',
                'user_information.age',
                'user_information.smoking',
                'user_information.biography',
                'user_information.gender',
                'user_information.pets',
                'user_information.ethnicity',
            ],
            include: {
                model: User_Information,
                attributes: [],
                where: userInfoFilter,
            },
        },
    );

    return users;
}

engineUser.userSearch = userSearch;

// engineUser.userSearch = wrapper.wrapperForNoTryCatchAsyncFunction(userSearch);

/**
 * Update key (Column) value (value) pairs in the DB user table
 *
 * @param userId
 * @param newKeyValuePairs
 * @returns {Promise<*>}
 */
async function updateUserImplicit(userId, newKeyValuePairs) {
    const result = User.update(
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

engineUser.updateUserImplicit = updateUserImplicit;

// engineUser.updateUserImplicit = wrapper.wrapperForNoTryCatchAsyncFunction(updateUserImplicit);

async function updateUser(userId, firstname, lastname, email) {
    const result = User.update(
        {
            // username,
            firstname,
            lastname,
            // phone,
            email,
            // password,
            // usertype,
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

engineUser.updateUser = updateUser;

/**
 * Check if username given is already in the DB user table
 * @param username
 * @returns {Promise<boolean>}
 */
async function checkIfUsernameExists(username) {
    const boolean = engineUser.getUserByUsername(username);
    // .then((token) => token !== null)
    // .then((isUnique) => isUnique);

    return boolean;
}

engineUser.checkIfUsernameExists = checkIfUsernameExists;

// engineUser.checkIfUsernameExists = wrapper.wrapperForNoTryCatchAsyncFunction(checkIfUsernameExists);

/**
 * Check if email given is already in the DB user table
 *
 * Reference:
 *      https://stackoverflow.com/a/42737209/9133458
 * @param email
 * @returns {Promise<boolean>}
 */
async function checkIfEmailExists(email) {
    const boolean = engineUser.getUserByEmail(email);
    // .then((token) => token !== null)
    // .then((isUnique) => isUnique);

    return boolean;
}

engineUser.checkIfEmailExists = checkIfEmailExists;

// engineUser.checkIfEmailExists = wrapper.wrapperForNoTryCatchAsyncFunction(checkIfEmailExists);

/**
 * Check if userId given is already in the DB user table
 *
 * @param userId
 * @returns {Promise<boolean>}
 */
async function checkIfUserIdExists(userId) {
    const boolean = engineUser.getUserByUserId(userId);
    // .then((token) => token !== null)
    // .then((isUnique) => isUnique);

    return boolean;
}

engineUser.checkIfUserIdExists = checkIfUserIdExists;

// engineUser.checkIfUserIdExists = wrapper.wrapperForNoTryCatchAsyncFunction(checkIfUserIdExists);

async function deleteUserById(userId) {
    const result = await User.destroy({
        // raw does not work here
        where: {
            user_id: userId,
        },
    });

    return !!result;
}

engineUser.deleteUserById = deleteUserById;

module.exports = engineUser;
