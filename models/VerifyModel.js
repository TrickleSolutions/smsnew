
const { Schema, model } = require('mongoose');


const schema = new Schema({
    otp: String,
    otpid: String,
    otpExpireTime: Date,
}, {
    timestamps: true
})


const VerifyModel = model("otp", schema);

module.exports = VerifyModel;
