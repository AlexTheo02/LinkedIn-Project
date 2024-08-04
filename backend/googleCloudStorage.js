const {Storage} = require('@google-cloud/storage');

// Google Cloud Storage
const gc = new Storage({
    keyFilename: process.env.KEY_FILENAME,
    projectId: process.env.PROJECT_ID
});

// gc.getBuckets().then(x => console.log(x)); // Used for debugging

// Google Cloud Storage Bucket
const lp_bucket = gc.bucket(process.env.BUCKET_NAME);

module.exports = lp_bucket;