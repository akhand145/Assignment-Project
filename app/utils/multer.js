const multer = require('multer');
const httpStatus = require('http-status');
const response = require('../response/index');
const { fileSize } = require('../constant/common');

const uploadFiles = (fields) => async (req, res, next) => {
  const upload = multer({ fileFilter, limits: { fileSize } }).fields(fields);
  upload(req, res, (error) => {
    if (error) {
      return response.error(req, res, { msgCode: error.code }, httpStatus.BAD_REQUEST);
    } else {
      next();
    }
  });
};

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.toLowerCase() === 'image/png' ||
    file.mimetype.toLowerCase() === 'image/jpg' ||
    file.mimetype.toLowerCase() === 'image/jpeg' ||
    file.mimetype.toLowerCase() === 'application/pdf' ||
    file.mimetype.toLowerCase() === 'video/mp4'
  ) {
    cb(null, true);
  } else {
    cb({ code: 'WRONG_FILE_TYPE', fileName: file.fieldname }, false);
  }
};

module.exports = { fileFilter, uploadFiles };
