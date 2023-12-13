const Joi = require('joi');
const constant = require('../constant/auth');
const { defaultDevice, wrongPassword, userStatus, blockType } = require('../constant/auth');

const userSignup = Joi.object({
    name: Joi.string().trim().required(),
    profilePic: Joi.string(),
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string()
      .regex(
        constant.regexForPassword)
      .message(wrongPassword)
      .min(8).max(20).trim()
      .required(),
    mobileNo: Joi.string()
      .length(10)
      .pattern(constant.regexForMobile)
      .trim().required(),
    userAddress: Joi.object({
        state: Joi.string().trim().required(),
        district: Joi.string().trim().required(),
        address: Joi.string().min(5).max(50).trim().required(),
        pincode: Joi.string()
          .length(6)
          .pattern(constant.regexForPincode)
          .trim().required()
      }),
  });

const login = Joi.object({
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string().required(),
  deviceToken: Joi.string().trim().required(),
  deviceId: Joi.string().trim().required(),
  deviceType: Joi.string().trim().optional()
});

module.exports = {
    userSignup,
    login
};
