/*
Validate inputs

Reference:
    Joi API
        Reference:
            https://joi.dev/api/?v=17.4.2#introduction

    Joi Regex
        Reference:
            https://joi.dev/api/?v=17.4.2#anymessagemessage

    Node.js + Joi how to display a custom error messages?
        Reference:
            https://stackoverflow.com/questions/48720942/node-js-joi-how-to-display-a-custom-error-messages

    How to set custom error messages in @hapi/joi?
        Notes:
            Custom error message for joi
        Reference:
            https://stackoverflow.com/questions/58408362/how-to-set-custom-error-messages-in-hapi-joi

    Confirm password cannot be set as required with JOI
        Notes:
            This the most up todate version on how to correctly validate a password which would allow you to
            setup a custom failure message
        Reference:
                https://stackoverflow.com/a/60909048/9133458
*/

const Joi = require('joi');

// TODO THIS SHOULD BE SHARED WITH THE FRONT END
const nameRegex = /^[A-Za-z]+$/;
const usernameRegex = /^(?=.*\d)(|.*[a-z])(|.*[A-Z])[0-9+a-zA-Z]{3,}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneNumberRegex = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;

const joiSchemas = {};

// joiSchemas.SCHEMA_USER_SIGNUP_JOI_STYLE = Joi.object()
//     .keys({
//
//         // String from 8 to 32 chars
//         username: Joi.string()
//             .alphanum()
//             .min(3)
//             .max(32),
//
//         // String from 8 to 32 chars
//         password: Joi.string()
//             .alphanum()
//             .min(8)
//             .max(32),
//
//         // Reference to the key 'password'
//         password_repeat: Joi.ref('password'),
//
//         // String from 1 to 32 chars
//         firstname: Joi.string()
//             .alphanum()
//             .min(1)
//             .max(32),
//
//         // String from 1 to 32 chars
//         lastname: Joi.string()
//             .alphanum()
//             .min(1)
//             .max(32),
//
//         // Phone number up 32 ints
//         phone: Joi.number()
//             .integer()
//             .max(32),
//
//         // Emails
//         email: Joi.string()
//             .email({
//                     // Domain must have at least 2 chars (e.g @co, @ca)
//                     minDomainSegments: 2,
//                     /*
//                     tlds is Top Level Domains from the IANA registry
//
//                     Examples:
//                             tlds: { allow: ['com', 'net'] }
//                             tlds: false,
//                     */
//                     tlds: false,
//             })
//
//         // URIs only
//         profile_url: Joi.string()
//             .uri(), // Allow only urls
//
//         // String up to 45 chars
//         biography: Joi.string()
//             .alphanum()
//             .max(45),
//
//         // An int
//         age: Joi.number()
//             .integer(),
//
//         // 0 or 1
//         smoking: Joi.number()
//             .integer()
//             .valid(1, 2),
//
//         // String of only 3 choices
//         gender: Joi.string()
//             .valid('male', 'female', 'other'),
//
//         // 0 or 1
//         looking_for_housing: Joi.number()
//             .integer()
//             .valid(1, 2),
//
//         // 0 or 1
//         offering_housing: Joi.number()
//             .integer()
//             .valid(1, 2),
//
//         // 0 or 1
//         pets: Joi.number()
//             .integer()
//             .valid(1, 2),
//
//         // String
//         ethnicity: Joi.string()
//             .alphanum()
//             .min(1)
//             .max(30),
//
//         // 0 or 1
//         tos: Joi.number()
//             .integer()
//             .valid(1, 2),
//     });

/*
Joi Scheme used to validate users that signup

 */
joiSchemas.SCHEMA_USER_SIGNUP = Joi.object()
    .keys({
        // Username based on regex pattern
        username: Joi.string()
            .regex(usernameRegex)
            .required()
            .messages({
                'string.pattern.base': 'username does not follow format',
                // 'string.empty': 'Username must not be empty',
                // 'any.required': 'username key is missing from the body',
            }),

        // Password based on regex pattern
        password: Joi.string()
            .regex(passwordRegex)
            .required()
            .messages({
                'string.pattern.base': 'password does not follow format',
                // 'string.empty': 'Password must not be empty',
            }),

        // Reference to the key 'password'
        password_confirmation: Joi.string()
            .required()
            .valid(Joi.ref('password'))
            .messages({
                'any.only': 'passwords do not match',
                // 'string.empty': 'password confirmation must not be empty',
            }),

        // First name based on regex pattern
        firstname: Joi.string()
            .regex(nameRegex)
            .required()
            .messages({
                'string.pattern.base': 'firstname does not follow format',
                // 'string.empty': 'firstname must not be empty',
            }),

        // Last name based on regex pattern
        lastname: Joi.string()
            .regex(nameRegex)
            .required()
            .messages({
                'string.pattern.base': 'lastname does not follow format',
                // 'string.empty': 'lastname must not be empty',
            }),

        // Phone number based on regex pattern
        phone: Joi.string()
            .regex(phoneNumberRegex)
            .required()
            .messages({
                'string.pattern.base': 'phone does not follow format',
                // 'string.empty': 'phone must not be empty',
            }),

        // Email
        email: Joi.string()
            .regex(emailRegex)
            .required()
            .messages({
                'string.pattern.base': 'email does not follow format',
                // 'string.empty': 'email must not be empty',
            }),

    })
    .with('password', 'password_confirmation');

joiSchemas.SCHEMA_USER_LOGIN = Joi.object()
    .keys({
        // Username based on regex pattern
        username: Joi.string()
            // .regex(usernameRegex) // MUST NOT TELL THE USER THE FORMAT FOR USERNAME LOGIN
            .required()
            .messages({
                // 'string.pattern.base': 'username does not follow format',
                // 'string.empty': 'username must not be empty',
                // 'any.required': 'username key is missing from the body',
            }),

        // Password based on regex pattern
        password: Joi.string()
            // .regex(passwordRegex) // MUST NOT TELL THE USER THE FORMAT FOR PASSWORD LOGIN
            .required()
            .messages({
                // 'string.pattern.base': 'password does not follow format',
                // 'string.empty': 'password must not be empty',
            }),

    });

joiSchemas.SCHEMA_USER_UPDATE = Joi.object()
    .keys({
        // // Username based on regex pattern
        // username: Joi.string()
        //     .regex(usernameRegex)
        //     .messages({
        //         'string.pattern.base': 'Username does not follow format',
        //         'string.empty': 'Username must not be empty',
        //         // 'any.required': 'username key is missing from the body',
        //     }),
        //
        // // Password based on regex pattern
        // password: Joi.string()
        //     .regex(passwordRegex)
        //     .messages({
        //         'string.pattern.base': 'Password does not follow format',
        //         'string.empty': 'Password must not be empty',
        //     }),
        //
        // // Reference to the key 'password'
        // password_confirmation: Joi.string()
        //     .required()
        //     .valid(Joi.ref('password'))
        //     .messages({
        //         'any.only': 'Passwords do not match',
        //         'string.empty': 'Password Confirmation must not be empty',
        //     }),

        // First name based on regex pattern
        firstname: Joi.string()
            .regex(nameRegex)
            .messages({
                'string.pattern.base': 'firstname does not follow format',
            })
            .allow('')
            .allow(null),

        // Last name based on regex pattern
        lastname: Joi.string()
            .regex(nameRegex)
            .messages({
                'string.pattern.base': 'lastname does not follow format',
            })
            .allow('')
            .allow(null),

        // // Phone number based on regex pattern
        // phone: Joi.string()
        //     .regex(phoneNumberRegex)
        //     .messages({
        //         'string.pattern.base': 'Phone number does not follow format',
        //         'string.empty': 'Phone number must not be empty',
        //     }),

        // Email
        email: Joi.string()
            .regex(emailRegex)
            .messages({
                'string.pattern.base': 'Email does not follow format',
                // 'string.empty': 'Email must not be empty',
            })
            .allow('')
            .allow(null),

        // // Profile URL
        // profile_url: Joi.string()
        //     .max(2048)
        //     .messages({
        //         // 'string.pattern.base': 'Profile URL does not follow format',
        //         'string.empty': 'Profile URL must not be empty',
        //     }),

        // BROKEN AND FILE IS NOT LOCATED IN THE BODY
        // file: Joi.object({
        //     filename: Joi.string().required(),
        //     path: Joi.string().required(),
        //     headers: Joi.object({
        //         'content-disposition': Joi.string().required(),
        //         'content-type': Joi.string().valid(['image/jpeg']).required(),
        //     }).required(),
        //     bytes: Joi.number().required(),
        // }),

        // // Biography
        // biography: Joi.string()
        //     .max(45)
        //     .messages({
        //         // 'string.pattern.base': 'Biography does not follow format',
        //         'string.empty': 'Biography must not be empty',
        //     }),

        // // Age
        // age: Joi.number()
        //     .integer()
        //     .min(0)
        //     .max(1)
        //     .messages({
        //         // 'number.pattern.base': 'Age does not follow format',
        //         'number.empty': 'Age must not be empty',
        //     }),

        // Smoking
        smoking: Joi.number()
            .integer()
            .min(0)
            .max(1)
            .messages({
                // 'number.empty': 'Smoking must not be empty',
            })
            .allow('')
            .allow(null),

        // Gender
        gender: Joi.string()
            .max(32)
            .messages({
                // 'string.pattern.base': 'Gender does not follow format',
                // 'string.empty': 'Gender must not be empty',
            })
            .allow('')
            .allow(null),

        // Looking for housing
        looking_for_housing: Joi.number()
            .integer()
            .min(0)
            .max(1)
            .messages({
                // 'number.pattern.base': 'Looking for housing does not follow format',
                // 'number.empty': 'Looking for housing must not be empty',
            })
            .allow('')
            .allow(null),

        // Offering housing
        offering_housing: Joi.number()
            .integer()
            .min(0)
            .max(1)
            .messages({
                // 'number.pattern.base': 'Offering housing does not follow format',
                // 'number.empty': 'Offering housing must not be empty',
            })
            .allow('')
            .allow(null),

        // Pets
        pets: Joi.number()
            .integer()
            .min(0)
            .max(1)
            .messages({
                // 'number.pattern.base': 'Pets does not follow format',
                // 'number.empty': 'Pets must not be empty',
            })
            .allow('')
            .allow(null),

        // ethnicity
        ethnicity: Joi.string()
            .max(30)
            .messages({
                // 'string.pattern.base': 'Ethnicity does not follow format',
                // 'string.empty': 'Ethnicity must not be empty',
            })
            .allow('')
            .allow(null),
        image: Joi.string()
            .allow(null)
            .allow(''),
        age: Joi.string()
            .allow(null)
            .allow(''),
        biography: Joi.string()
            .max(2048)
            .allow(null)
            .allow(''),
    });
// .with('password', 'password_confirmation');

// joiSchemas.SCHEMA_LISTING_INFORMATION_UPDATE = Joi.object()
//     .keys({
//         address: Joi.string()
//             .max(128),
//         city: Joi.string()
//             .max(32),
//         state: Joi.string()
//             .max(45),
//         zip: Joi.string()
//             .max(16),
//         rooms: Joi.number()
//             .integer()
//             .min(0)
//             .allow(null),
//         max_capacity: Joi.number()
//             .integer()
//             .min(0)
//             .allow(null),
//     });

joiSchemas.SCHEMA_LISTING_ADD = Joi.object()
    .keys({
        address: Joi.string() // For listing
            .max(128)
            .required(),
        city: Joi.string() // For listing
            .max(32)
            .required(),
        state: Joi.string() // For listing
            .max(45)
            .required(),
        zip: Joi.string() // For listing
            .max(16)
            .required(),
        rooms: Joi.number() // For listing
            .integer()
            .min(0)
            .allow(null),
        max_capacity: Joi.number() // For listing
            .integer()
            .min(0)
            .allow(null),
        description: Joi.string() // For listing_information
            .max(2048)
            .allow(null),
        housing_type: Joi.string() // For listing_information
            .max(45)
            .allow(null),
        monthly_rent: Joi.number() // For listing_information
            .integer()
            .min(0)
            .allow(null),
        images: Joi.string()
            .allow(null)
            .allow(''),

    });

joiSchemas.SCHEMA_LISTING_UPDATE = Joi.object()
    .keys({
        listing_id: Joi.number() // For listing and listing_information
            .integer()
            .min(0)
            .required(),
        address: Joi.string() // For listing
            .max(128),
        city: Joi.string() // For listing
            .max(32),
        state: Joi.string() // For listing
            .max(45),
        zip: Joi.string() // For listing
            .max(16),
        rooms: Joi.number() // For listing
            .integer()
            .min(0)
            .allow(null),
        max_capacity: Joi.number() // For listing
            .integer()
            .min(0)
            .allow(null),
        description: Joi.string() // For listing_information
            .max(2048)
            .allow(null),
        housing_type: Joi.string() // For listing_information
            .max(45)
            .allow(null),
        monthly_rent: Joi.number() // For listing_information
            .integer()
            .min(0)
            .allow(null),
        images: Joi.string()
            .allow(null)
            .allow(''),
    });

module.exports = joiSchemas;
