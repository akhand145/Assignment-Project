const { env } = require('../constant/environment');

const userType = {
    USER: 0,
    ADMIN: 1
}

const userStatus = {
    BLOCK: 0,
    UNBLOCK: 1
}

const wrongOtp = `Otp should be of ${env.OTP_DIGIT} digits`;

const wrongPassword = 'Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.';

const regexForPassword = /^(?=. *[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const regexForMobile = /^\d{10}$/;

const regexForId = /^[a-f0-9]{24}$/;

const regexForPincode = /^\d{6}$/;

module.exports = {
    userType,
    userStatus,
    wrongOtp,
    wrongPassword,
    regexForPassword,
    regexForMobile,
    regexForId,
    regexForPincode
};