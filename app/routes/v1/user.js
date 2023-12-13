const router = require('express').Router();
const controller = require('../../controller/user');
const { reqValidator, verifyAuthToken } = require('../../middleware');
const schema = require('../../validation/user');

router.post('/signup', verifyAuthToken, reqValidator(schema.userSignup), controller.userSignup);

router.post('/login', verifyAuthToken, reqValidator(schema.login), controller.login, controller.createSession);

module.exports = router;
