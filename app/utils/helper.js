const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const response = require('../response/index');
const { env } = require('../constant/environment');
const { reqHeadersConstant } = require('../constant/auth');
const { Types } = require('mongoose');
const multer = require('multer');

exports.generateOtp = (digit) => {
  const otp = Math.floor(
    10 ** (digit - 1) + Math.random() * (10 ** (digit - 1) * 9)
  );
  return otp;
};

exports.filterFormatter = (filterFormat) => {
  const filterQuery = [];
  filterFormat.map((filter) => filterQuery.push(Types.ObjectId(filter)));
  return filterQuery;
};

exports.getPagination = (page, size) => {
  const limit = size || 10;
  const offset = page ? (page - 1) * limit : 0;
  return { limit, offset };
};

exports.getSuccessMsgCode = (req) => {
  let msgCode;
  if (req.url.slice(1) === 'signup') {
    msgCode = 'SIGNUP_SUCCESSFUL';
  } else {
    msgCode = 'LOGIN_SUCCESSFUL';
  }

  return msgCode;
};

exports.getErrorMsgCode = (req) => {
  let msgCode;
  if (req?.url.slice(1) === 'signup') {
    msgCode = 'SIGNUP_FAILED';
  } else {
    msgCode = 'LOGIN_FAILED';
  }

  return msgCode;
};

exports.getUserId = (req) => {
  let userId;
  let token = req?.headers.authorization;
  if (!token) {
    userId = null;
  } else {
    token = token.replace(/^Bearer\s+/, '');
    jwt.verify(token, env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        userId = null;
      }
      userId = decoded.userId;
    });
  }
  return userId;
};

exports.languageFormatter = (language) => {
  return reqHeadersConstant.includes(language) ? language : reqHeadersConstant[1];
};

exports.getCmsCode = (type) => {
  let msgCode;
  switch (type) {
    case cmsType.aboutUs:
      msgCode = 'ABOUT_US';
      break;
    case cmsType.contactUs:
      msgCode = 'CONTACT_US';
      break;
    case cmsType.privacyPolicy:
      msgCode = 'PRIVACY_POLICY';
      break;
    case cmsType.termsCondition:
      msgCode = 'TERMS_CONDITION';
      break;
    case cmsType.userManual:
      msgCode = 'USER_MANUAL';
      break;
  }
  return msgCode;
};

exports.checkFileType = (url) => {
  // const fileType = url.split('/')[4].split('.')[1].split('_')[1];
  if (url.includes('png') || url.includes('jpeg') || url.includes('jpg')) {
    return 0;
  } else {
    return 2;
  }
};

exports.convertInObjectId = (array) => {
  const newArray = [];
  array.forEach(element => {
    newArray.push(Types.ObjectId(element));
  });
  return newArray;
};

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'text/csv'
  ) {
    cb(null, true);
  } else {
    cb('WRONG_FILE_TYPE', false);
  }
};

exports.uploadFiles = (fields) => async (req, res, next) => {
  const upload = multer({fileFilter: fileFilter}).fields(fields);
  upload(req, res, (error) => {
    if (error) {
      return response.error(req, res, { msgCode: 'WRONG_FILE_TYPE' }, httpStatus.BAD_REQUEST);
    } else {
      next();
    }
  });
};
