const router = require('express').Router();
const authController = require('../controllers/auth');
const { check } = require('../custom/authmiddleware');

//Some Action To Signup!
router.post('/signup', authController.signup);

//Some Action To Login!
router.post('/login', authController.login);

//Some Action To Request Login OTP!
router.post('/request/otp', authController.requestLoginWithOTP);

//Some Action To Resend OTP Message!
router.post('/resend/otp', authController.resendOTP)

//Some Action To Login with OTP!
router.post('/login/otp', authController.loginWithOTP);

//Some Action To Refesh Token!
router.post('/refresh', authController.refresh)

//Some Action To Reset Password!
router.patch('/password', check, authController.patchPassword)

module.exports = router;