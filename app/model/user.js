const mongoose = require('mongoose');
const { userType, userStatus } = require('../constant/auth');
const db = require('../config/index');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        profilePic: {
            type: String
        },
        email: {
            type: String
        },
        password: {
            type: String
        },
        countryCode: {
            type: String,
            required: true,
            default: '+91'
        },
        mobileNo: {
            type: String,
            required: true
        },
        userAddress: {
            state: {
                type: String
            },
            district: {
                type: String
            },
            address: {
                type: String
            },
            pinCode: {
                type: Number
            }
        },
        userType: {
            type: Number,
            enum: [userType.USER, userType.ADMIN],
            default: userType.USER
        },
        status: {
            type: Number,
            enum: [userStatus.BLOCK, userStatus.UNBLOCK],
            default: userStatus.UNBLOCK
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        collection: 'User',
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('User', userSchema);