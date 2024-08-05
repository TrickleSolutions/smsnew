const router = require('express').Router()
const SendOtp = require('../controllers/SendOtpController')

// send otp router

router.get("/otp", SendOtp);

module.exports = router;
