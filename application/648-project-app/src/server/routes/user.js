/*
Signup non registered user (Old)

*** EXAMPLE OLD ***
{
    "username": "josephe",
    "password": "password",
    "password_confirmation": "password",
    "firstname": "Joseph",
    "lastname": "Edradan",
    "phone": "123-123-4444",
    "email": "josephedradan@mail.com",

    "profile_url": "https://nd.net/wp-content/uploads/2016/04/profile-dummy.png",
    "biography": "My biography is good",
    "age": 21,
    "smoking": 0,
    "gender": "male",
    "looking_for_housing" : 1,
    "offering_housing": 1,
    "pets": 0,
    "ethnicity": "Asian",
    "tos": true
}
*/

/*
Advanced Search (OLD)

for filter, action="/user/advancedSearch"

*** EXAMPLE ***
{
    user_id: 8,
    username: 'yunasuzuki5234',
    firstname: 'Yuna',
    lastname: 'Suzuki',
    phone: '538-1231',
    email: 'yunatys@hotmail.com',
    profile_url: 'https://nd.net/wp-content/uploads/2016/04/profile-dummy.png',
    age: 21,
    smoking: 0,
    gender: 'female',
    pets: 0,
    ethnicity: 'East Asian'
  }
*/

// ################## IGNORE THE ABOVE ##################

const express = require('express');

const userController = require('../controllers/controller_user');

const middlewareValidation = require('../middleware/middleware_validation');
const middlewareAuthentication = require('../middleware/middleware_passport');
const middlewareFileUpload = require('../middleware/middleware_file_upload');
const middlewareDebug = require('../middleware/middleware_debug');

const routerUser = express.Router();

routerUser.use(middlewareDebug.preMiddlewareDebugFullWithMessage('Route: user'));

/*
Get registered user by user_id

Notes:
    Get registered user by user_id.
    Must be logged in to user this function.

Format:
    http://localhost:3000/api/user/?user_id=USER_ID

 */ // FIXME: IS THIS THE RIGHT FORMAT YOU WANT??? WHY NOT /api/user/:username or /api/user/:user_id rather than /api/user/?user_id=1
routerUser.get(
    '/',
    // middlewareAuthentication.checkAuthenticated, // Check if logged in
    userController.getUserAndUserInformationByUserId,
);

/*
Sign up non registered user

Notes:
    Will create registered user

Route:
    POST
        .../api/user/signup
        TODO: SHOULD BE .../api/user/

Example:
    JSON
        {
            "username": "josephe123",
            "password": "Password123!",
            "password_confirmation": "Password123",
            "firstname": "Joseph",
            "lastname": "Edradan",
            "phone": "123-123-4444",
            "email": "josephedradan@fake.com",
        }
 */
routerUser.post(
    '/',
    // middlewareAuthentication.checkUnauthenticated, // Commented out so that you can register multiple times regardless of being already authenticated (logged in) or not
    middlewareValidation.validateUserSignup, // Validate req.body for Signup
    middlewareDebug.preMiddlewareDebugSimpleWithMessage('userController.signup'),
    userController.signup,
);

/*
Update logged in registered user

Notes:
    Will update logged in registered user.
    Must be logged in to user this function.

    In the format, notice that some things are commented out because front end does not support those inputs

Route:
    PUT
        .../api/user/

Format:
    FORM
        {
            // "username": "string",
            // "password": "string",
            // "password_confirmation": "string",
            "firstname": "string",
            "lastname": "string",
            // "phone": "int/string",
            "email": "string",
            // "biography": "string",
            // "age": "int",
            "smoking": "int",
            "gender": "string",
            "looking_for_housing": "int",
            "offering_housing": "int",
            "pets": "int",
            "ethnicity": "string",

            "image": ...,
        }

 */
routerUser.put(
    '/',
    middlewareAuthentication.checkAuthenticated, // Check if logged in
    /*
    1. Uploads the file to the machine to its appropriate directory based on the from key called 'image'
    2. Places the information about the file uploaded to the machine into req.file
    3. *** POPULATES req.body WITH THE FORM DATA. THIS MEANS THAT IF YOU WANT TO VALIDATION FOR req.body YOU NEED TO CALL THIS MIDDLEWARE FIRST
     */
    middlewareFileUpload.single('image'), // Validate form image and assign form data to req.body
    middlewareValidation.validateUserUpdate, // Validate req.body for User & User Information Update
    middlewareDebug.preMiddlewareDebugSimpleWithMessage('userController.update'),
    userController.update,
);

// TODO: DELETE USER ROUTE

/*
Basic Search

Route:
    GET
        .../api/user/search

Example:
    http://localhost:3000/api/user/search?key=bob

 */

routerUser.get(
    '/search',
    userController.basicSearch,
);

/*
Advanced Search

Notes:

Route:
    GET
        .../api/user/advancedSearch

Example:
    http://localhost:3000/api/user/advancedSearch?ethnicity=East Asian&gender=female&smoking_checkbox=1&pets_checkbox=0

 */
routerUser.get(
    '/advancedSearch',
    userController.advancedSearch,
);

/*
Log in registered user

Notes:
    Will log in logged out registered user.
    Must be logged out to user this function.

Route:
    POST
        .../api/user/login

Format:
    JSON
        {
            "username": "string",
            "password": "string",
        }

 */
routerUser.post(
    '/login',
    middlewareAuthentication.checkUnauthenticated, // Check if not logged in
    middlewareValidation.validateUserLogin, // Validate req.body for login
    // passport.authenticate('local'), // Use this if you are not using a custom callback for passport.authenticate within userController.login
    middlewareAuthentication.authenticate('local'),
    userController.login,
);

/*
Log out registered user

Notes:
    Will log out logged in registered user.
    Must be logged in to user this function.

Route:
    POST
        .../api/user/logout

Format:
    NONE

 */
routerUser.post(
    '/logout',
    middlewareAuthentication.checkAuthenticated, // Check if logged in
    userController.logout,
);

routerUser.delete(
    '/',
    middlewareAuthentication.checkAuthenticated, // Check if logged in
    userController.delete,
);

module.exports = routerUser;
