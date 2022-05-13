/*

Notes:
    S3 Bucket Policy
        Notes:
            Put the settings into
        Settings
            {
              "Id": "Policy1637652002576",
              "Version": "2012-10-17",
              "Statement": [
                {
                  "Sid": "Stmt1637651994292",
                  "Action": [
                    "s3:GetObject"
                  ],
                  "Effect": "Allow",
                  "Resource": "arn:aws:s3:::csc-648-project-team-02-storage/*",
                  "Principal": "*"
                }
              ]
            }

Reference:
    Upload Images to S3 from Node Back End
        Notes:
            S3 notes
        Reference:
            https://www.youtube.com/watch?v=NZElg91l_ms

    Setting Credentials in Node.js
        Notes:
            Setting up credentials for s3 bucket actions.
            For server, you need to use option 1 where you apply roles to the EC2 instance.
            For local, you need to use option 4 because reading from a json file is simple.

        Reference:
            https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html

    Loading Credentials in Node.js from a JSON File
        Notes:
            Uploads based on json file (option 4)
        Reference:
            https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-json-file.html

    Upload files to a specific folder in the bucket with AWS SDK
        Notes:
            Folders don't actually exist in AWS, they are prefixes
        Reference:
            https://stackoverflow.com/questions/51214518/upload-files-to-a-specific-folder-in-the-bucket-with-aws-sdk
 */

const awsSDK = require('aws-sdk');
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
const path = require('path');
const to = require('await-to-js').default;

const PATH_AWS_CONFIG = path.join(__dirname, '../', '/config', 'aws_config.json');

const AWS_CONFIG = require(PATH_AWS_CONFIG);

const debugPrinter = require('../utils/debug_printer');
const wrapper = require('../utils/wrapper');
const constants = require('../config/constants');

const AWS_BUCKET_NAME = AWS_CONFIG.bucketName;
const AWS_BUCKET_REGION = AWS_CONFIG.region;
const AWS_ACCESS_KEY_ID = AWS_CONFIG.accessKeyId;
const AWS_SECRET_ACCESS_KEY = AWS_CONFIG.secretAccessKey; // Never let anyone see this

// TODO: IF WE ARE GOING TO USE FOLDER ORGANIZATION, THEN USE THESE IN THE FILENAME
const PATH_AWS_PROFILE = 'profile/';
const PATH_AWS_LISTING = 'listing/';

// Config the aws SDK instance to use the config settings
awsSDK.config.loadFromPath(PATH_AWS_CONFIG);

/*
s3 bucket object

Notes:
    the options currently commented out are deprecated and
    are correctly implemented via awsSDK.config.loadFromPath()

 */
const s3 = new S3({
    // region: AWS_BUCKET_REGION,
    // accessKeyId: AWS_ACCESS_KEY_ID,
    // secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const handlerAWSS3Bucket = {};

/**
 * Upload file to AWS s3 bucket given req.reqFile
 *
 * Notes:
 *      THIS FUNCTION CAN BE ASYNC OR NOT ASYNC AS LONG AS .promise() IS RETURNED
 *
 * @param reqFile
 * @returns {Promise<ManagedUpload.SendData>}
 */
async function uploadFile(reqFile) {
    // Read from where the reqFile is located on the server (or local computer)
    const fileStream = fs.createReadStream(reqFile.path);

    // Setup parameters for the file to be uploaded
    const uploadFileParams = {
        Bucket: AWS_BUCKET_NAME,
        Body: fileStream,
        Key: reqFile.filename, // WARNING: DO NOT USE path.join ON A WINDOWS MACHINE BECAUSE IT WILL USE \ INSTEAD OF /
    };

    if (process.env.NODE_ENV === 'development') {
        debugPrinter.printBackendBlue('handlerAWSS3Bucket.uploadFile');
    }

    // Upload file to s3 bucket and return its result using a promise
    return s3.upload(uploadFileParams)
        .promise();
}

handlerAWSS3Bucket.uploadFile = uploadFile;

// handlerAWSS3Bucket.uploadFile = wrapper.wrapperForNoTryCatchAsyncFunction(uploadFile);

/**
 * Upload file to AWS s3 bucket given req.file and return the route to that image relative to this server
 *
 *
 * @param reqFile
 * @returns {Promise<string>}
 */
async function uploadFileAndGetURL(reqFile) {
    // const [error, result] = await to(uploadFile(reqFile));
    //
    // debugPrinter.printBackendBlue('uploadFileAndGetURL');
    // debugPrinter.printBackendBlue(result);
    //
    // if (error) {
    //     throw error;
    // }
    //
    // // Add a route parameter to point to where the upload image is located
    // return constants.PATH_ROUTE_IMAGES + result.Key;

    if (process.env.NODE_ENV === 'development') {
        debugPrinter.printBackendBlue('handlerAWSS3Bucket.uploadFileAndGetURL');
    }

    const result = await uploadFile(reqFile);

    if (process.env.NODE_ENV === 'development') {
        debugPrinter.printBackendBlue(result);
    }

    // Add a route parameter to point to where the upload image is located
    return constants.PATH_ROUTE_IMAGES + result.Key;
}

handlerAWSS3Bucket.uploadFileAndGetURL = uploadFileAndGetURL;

// handlerAWSS3Bucket.uploadFileAndGetURL = wrapper.wrapperForNoTryCatchAsyncFunction(uploadFileAndGetURL);

/**
 * Download file from S3 bucket via stream
 *
 * Notes:
 *      If you use this function, call the method .pip(res) where res is the response in your server framework (e.g. Express)
 *
 *      This function makes the server act like a middleman between the S3 bucket and the client. The server
 *      has access of the S3 bucket because of it's special access from the config file. Alternatively,
 *      the config file that gives this server access to the S3 bucket can be automatic with AWS policy settings
 *      because Amazon has access to the policies and is the owner of the server. However, the config file is
 *      necessary for local servers to have access to the S3 bucket. For the best type of authorization to the S3 bucket
 *      on local servers, suggest using ENV variables or whatever from
 *      https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html
 *
 * @param fileURL
 * @returns {Promise<null|stream.Readable>}
 */
async function downloadFileAsync(fileURL) {
    const key = fileURL.split('/')
        .pop();

    // Setup parameters for the file to be downloaded
    const downloadFileParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: key,
    };

    if (await handlerAWSS3Bucket.checkIfFileExistsAsync(fileURL)) { // If file exists in AWS S3 Bucket
        // Return a stream for the user to download the file from the AWS S3 Bucket
        return s3.getObject(downloadFileParams)
            .createReadStream();
    }

    // File does not exist in AWS S3 Bucket
    return null;
}

handlerAWSS3Bucket.downloadFileAsync = downloadFileAsync;

// handlerAWSS3Bucket.downloadFileAsync = wrapper.wrapperForNoTryCatchAsyncFunction(downloadFileAsync);

/**
 *
 * Delete file from S3 bucket
 *
 * Notes:
 *      THIS FUNCTION CAN BE ASYNC OR NOT ASYNC AS LONG AS .promise() IS RETURNED
 *
 * Reference:
 *      deleteObject
 *          Reference:
 *              https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
 *
 * @param fileURL
 * @returns {Promise<null|boolean>}
 */
async function deleteFileAsync(fileURL) {
    const key = fileURL
        .split('/')
        .pop();

    // Setup parameters for the file to be downloaded
    const deleteFileParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: key, // This key should match the key from handlerAWSS3Bucket.uploadFile
    };

    // Check if file exists in AWS S3
    if (!(await handlerAWSS3Bucket.checkIfFileExistsAsync(fileURL))) {
        // File does not exist in AWS S3 Bucket
        return false;
    }

    // Delete file from AWS S3 bucket
    const [error, result] = await to(s3.deleteObject(deleteFileParams)
        .promise());

    // AWS S3 Bucket Error (This error is probably an error in the config of the AWS S3 Bucket)
    if (error) {
        throw error;
    }
    // File deleted from AWS S3 Bucket
    return true;
}

handlerAWSS3Bucket.deleteFileByURLAsync = deleteFileAsync;

// handlerAWSS3Bucket.deleteFileByURLAsync = wrapper.wrapperForNoTryCatchAsyncFunction(deleteFileByURLAsync);

/**
 * Check if file key exists in the S3 bucket given file url
 *
 * Reference:
 *      How to determine if object exists AWS S3 Node.JS sdk
 *          Reference:
 *              https://stackoverflow.com/a/26950546/9133458
 *
 * @param fileURL
 * @returns {Promise<boolean>}
 */
async function checkIfFileExistsAsync(fileURL) {
    const key = fileURL.split('/')
        .pop();

    const checkParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: key,
    };

    const [error, result] = await to(s3.headObject(checkParams)
        .promise());

    /*
    AWS S3 bucket Error

    Notes:
        I suggest that you should not throw an error if an error exists because
        there are a variety of errors such as checking whether a file exists in the
        S3 bucket or not.

     */
    if (error) {
        // File does not exist in AWS S3 Bucket (THIS MAY OR MAY NOT BE TRUE DEPENDING ON YOUR AWS S3 BUCKET POLICY)
        if (error.code === 'NotFound') {
            return false;
        }

        // Other AWS S3 Bucket Error
        return false;
    }

    // File exists in AWS S3 Bucket
    return true;
}

handlerAWSS3Bucket.checkIfFileExistsAsync = checkIfFileExistsAsync;
// handlerAWSS3Bucket.checkIfFileExistsAsync = wrapper.wrapperForNoTryCatchAsyncFunction(checkIfFileExistsAsync);

module.exports = handlerAWSS3Bucket;
