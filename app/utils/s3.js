const AWS = require('aws-sdk');
const { env } = require('../constant/environment');

// Create an s3 instance
const s3 = new AWS.S3({
  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_SECRET_KEY,
  region: env.AWS_REGION
});

const deleteObject = async (url) => {
  try {
    const fileUrl = findKeyInUrl(url);
    const params = {
      Bucket: env.BUCKET_NAME,
      Key: fileUrl
    };
    await s3.deleteObject(params).promise();
    return true;
  } catch (err) {
    return err;
  }
};

const deleteObjects = async (url) => {
  try {
    const fileUrl = [];
    url.forEach((obj) => {
      fileUrl.push({ Key: findKeyInUrl(obj) });
    });
    const params = {
      Bucket: env.BUCKET_NAME,
      Delete: { Objects: fileUrl }
    };
    await s3.deleteObjects(params).promise();
    return true;
  } catch (err) {
    return err;
  }
};

const findKeyInUrl = (file) => {
  return decodeURIComponent(file);
};

const listOfObjects = async () => {
  try {
    const list = await s3.listObjectsV2({ Bucket: env.BUCKET_NAME }).promise();
    return list;
  } catch (err) {
    return err;
  }
};

const findAS3Object = async (url) => {
  try {
    const list = await s3.listObjectsV2({ Bucket: env.BUCKET_NAME, Delimiter: url }).promise();
    return list.CommonPrefixes.length !== 0;
  } catch (err) {
    return err;
  }
};

module.exports = { findAS3Object, listOfObjects, findKeyInUrl, deleteObject, deleteObjects };
