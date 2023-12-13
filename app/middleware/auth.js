const jwt = require('jsonwebtoken');
const response = require('../response/index');
const httpStatus = require('http-status');
const { SessionModel } = require('../model/index');
const { env } = require('../constant/environment');
const constant = require('../constant/auth');

// This function is used for validate API key

exports.verifyApiKey = (req, res, next) => {
  try {
    const ApiKey = req?.headers['x-api-key'];
    if (!ApiKey) {
      return response.error(
        req,
        res,
        { msgCode: 'MISSING_API_KEY', data: { redirection: false } },
        httpStatus.UNAUTHORIZED
      );
    }

    if (ApiKey !== env.API_KEY) {
      return response.error(
        req,
        res,
        { msgCode: 'INVALID_API_KEY', data: { redirection: false } },
        httpStatus.UNAUTHORIZED
      );
    }
    return next();
  } catch (error) {
    return response.error(
      req,
      res,
      { msgCode: 'SOMETHING_WRONG' },
      httpStatus.SOMETHING_WRONG
    );
  }
};

// This function is used for generate jwt token

exports.generateAuthJwt = (payload) => {
  const { expiresIn, ...params } = payload;

  const token = jwt.sign(params, env.SECRET_KEY, { expiresIn });
  if (!token) return false;

  return token;
};

exports.verifyAuthToken = (req, res, next) => {
  try {
    let token = req?.headers.authorization;
    if (!token) {
      return response.error(
        req,
        res,
        { msgCode: 'MISSING_TOKEN', data: { redirection: false } },
        httpStatus.UNAUTHORIZED
      );
    }
    token = token.replace(/^Bearer\s+/, '');

    jwt.verify(token, env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        let msgCode = 'INVALID_TOKEN';
        if (error.message === constant.errorMsg.EXPIRED) {
          msgCode = 'TOKEN_EXPIRED';
        }
        return response.error(req, res, { msgCode, data: { redirection: true } }, httpStatus.UNAUTHORIZED);
      }
      const checkJwt = await commonService.getByCondition(SessionModel, { jwtToken: token });
      if (!checkJwt) {
        return response.error(
          req,
          res,
          { msgCode: 'INVALID_TOKEN', redirection: true },
          httpStatus.UNAUTHORIZED
        );
      } else {
        req.data = decoded;
        return next();
      }
    });
  } catch (err) {
    return response.error(
      req,
      res,
      { msgCode: 'SOMETHING_WRONG' },
      httpStatus.SOMETHING_WRONG
    );
  }
};

exports.isUser = (req, res, next) => {
  try {
    const jwtData = req.data;
    if (jwtData.userType !== constant.userType.USER) {
      return response.error(
        req,
        res,
        { msgCode: 'UNAUTHORIZED', data: { redirection: true } },
        httpStatus.UNAUTHORIZED
      );
    } else {
      req.data = jwtData;
      return next();
    }
  } catch (err) {
    return response.error(
      req,
      res,
      { msgCode: 'SOMETHING_WRONG' },
      httpStatus.SOMETHING_WRONG
    );
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    const jwtData = req.data;
    if (jwtData.userType !== constant.userType.ADMIN) { return response.error(req, res, { msgCode: 'UNAUTHORIZED' }, httpStatus.UNAUTHORIZED); } else {
      req.data = jwtData;
      return next();
    }
  } catch (err) {
    return response.error(req, res, { msgCode: 'SOMETHING_WRONG' }, httpStatus.SOMETHING_WRONG);
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    const token = req?.headers.token;
    if (!token) return response.error(req, res, { msgCode: 'MISSING_TOKEN', data: { redirection: false } }, httpStatus.UNAUTHORIZED);
    jwt.verify(token, env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        let msgCode = 'INVALID_TOKEN';
        if (error.message === constant.errorMsg.EXPIRED) {
          msgCode = 'TOKEN_EXPIRED';
        }
        return response.error(req, res, { msgCode, redirection: true }, httpStatus.UNAUTHORIZED);
      }
      req.token = decoded;
      return next();
    });
  } catch (err) {
    return response.error(
      req,
      res,
      { msgCode: 'SOMETHING_WRONG' },
      httpStatus.SOMETHING_WRONG
    );
  }
};
