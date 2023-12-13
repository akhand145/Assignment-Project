const response = require('../response/index');
const httpStatus = require('http-status');
const commonService = require('../services/common');
const { UserModel } = require('../model/index');

// this function is used for check phone no is exist or not if exist it returns already registered

exports.isUserExist = async (req, res, next) => {
  try {
    const { mobileNo } = req.body;
    const condition = { mobileNo };
    const checkPhoneVerify = await commonService.getByCondition(
      UserModel,
      condition
    );
    if (checkPhoneVerify) {
      console.log(checkPhoneVerify.isMobileVerify);
      if (!checkPhoneVerify.isMobileVerify) {
        return next();
      }
    }
    return response.error(
      req,
      res,
      { msgCode: 'ALREADY_REGISTERED' },
      httpStatus.CONFLICT
    );
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: 'SOMETHING_WRONG' },
      httpStatus.SOMETHING_WRONG
    );
  }
};

exports.isEmailExist = async (req, res, next) => {
  try {
    const { email } = req.body;
    const condition = { email: email.toLowerCase(), isEmailVerify: true, isProfileCompleted: true, isDeleted: false };
    const checkEmailExist = await commonService.getByCondition(
      UserModel,
      condition
    );

    if (!checkEmailExist) {
      return next();
    }
    return response.error(
      req,
      res,
      { msgCode: 'ALREADY_REGISTERED' },
      httpStatus.CONFLICT
    );
  } catch (error) {
    return response.error(
      req,
      res,
      { msgCode: 'SOMETHING_WRONG' },
      httpStatus.SOMETHING_WRONG
    );
  }
};