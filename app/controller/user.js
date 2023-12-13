const authJwt = require('../middleware');
const commonService = require('../services/common');
const { env } = require('../constant/environment');
const httpStatus = require('http-status');
const helper = require("../utils/helper");
const passwordHash = require('../utils/password');
const response = require('../response/index');
const { UserModel, SessionModel } = require('../model/index');
const { userType, userStatus } = require('../constant/auth');

exports.userSignup = async (req, res) => {
    try {
      const { name, profilePic, email, password, mobileNo, userAddress } = req.body;
  
      const hashPass = await passwordHash.generateHash(password);
      const userData = {
        name,
        profilePic,
        email,
        password: hashPass,
        mobileNo,
        userAddress
      };

    const createUser = await commonService.create(UserModel, userData);
    if (!createUser) return response.error(req, res, { msgCode: 'USER_SIGNUP_FAILED' }, httpStatus.FORBIDDEN);
  
    return response.success(req, res, { msgCode: 'SIGNUP_SUCCESSFULLY', data: createUser }, httpStatus.CREATED);
    } catch (error) {
      return response.error(req, res, { msgCode: 'SOMETHING_WRONG' }, httpStatus.SOMETHING_WRONG);
    }
  };  
  
  exports.login = async (req, res, next) => {
    try {
      const { email, password, deviceId, deviceToken, deviceType } = req.body;
  
      const checkUser = await commonService.getByCondition(UserModel, { email, isDeleted: false });
      if (!checkUser) {
        return response.error(req, res, { msgCode: "INVALID_CREDENTIALS" }, httpStatus.UNAUTHORIZED);
      }
  
      const isLogin = passwordHash.comparePassword(password, checkUser.password);
      if (!isLogin) {
        return response.error(req, res, { msgCode: "INVALID_CREDENTIALS" }, httpStatus.UNAUTHORIZED);
      }
  
      // check status if block than return
      if (checkUser.status === userStatus.BLOCK) {
        return response.error(req, res, { msgCode: "USER_BLOCKED" }, httpStatus.UNAUTHORIZED);
      }
    
      const { ...resultData } = checkUser;
      resultData.token = authJwt.generateAuthJwt({
        id: checkUser._id,
        userType: checkUser.userType,
        expiresIn: env.TOKEN_EXPIRES_IN,
        email,
        deviceId,
      });
  
      if (!resultData.token) {
        return response.error(req, res, { msgCode: "SOMETHING_WRONG" }, httpStatus.SOMETHING_WRONG);
      }
  
      // Passing login data to another middleware
      req.loginData = {
        dbTrans,
        deviceDetails: { deviceId, deviceToken, deviceType },
        authDetails: resultData,
      };
  
      return next();
    } catch (error) {
      return response.error(req, res, { msgCode: "INTERNAL_SERVER_ERROR" }, httpStatus.INTERNAL_SERVER_ERROR);
    }
  };
  
  exports.createSession = async (req, res) => {
    try {
      const { deviceId, deviceToken, deviceType } = req.loginData.deviceDetails;
      const condition = { deviceId };
  
      const checkSession = await commonService.getByCondition(SessionModel, condition);
  
      if (checkSession) {
        const destroySession = await commonService.removeById(SessionModel, checkSession._id);
        if (!destroySession) return response.error(req, res, { msgCode: 'LOGIN_FAILED' }, httpStatus.FORBIDDEN);
      }
  
      const sessionData = {
        userId: req.loginData.authDetails._id,
        deviceId,
        deviceToken,
        deviceType,
        jwtToken: req.loginData.authDetails.token,
      };
  
      const createSession = await commonService.create(SessionModel, sessionData);
      if (!createSession) {
        return response.error(req, res, { msgCode: helper.getErrorMsgCode(req) }, httpStatus.INTERNAL_SERVER_ERROR);
      }
  
      const { ...data } = req.loginData.authDetails;
  
      const msgCode = helper.getSuccessMsgCode(req);
      return response.success(req, res, { msgCode, data }, httpStatus.OK);
    } catch (error) {
      return response.error(req, res, { msgCode: "INTERNAL_SERVER_ERROR" }, httpStatus.INTERNAL_SERVER_ERROR);
    }
  };