
const express = require('express')
const router = express.Router()

const passport = require('passport');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt/lib/strategy');

const checkauth = passport.authenticate('jwt', { session: false});
const checkgoogle = passport.authenticate('googleToken', { session: false});
const checkfacebook = passport.authenticate('facebookToken', { session: false });



const {
    user_register,
    user_activation,
    user_loggedIn,
    user_login_google,
    user_login_facebook,
    user_forgot_password,
    user_reset_password,
    user_current
} = require('../controllers/user')




// @route   POST localhost:5000/api/users/register
// @desc    가입 정보를 암호화(token)해서 메일로 보냄
// @access  Public

router.post('/register', user_register)


// @route POST user/activation
// @desc  Activation account / confrim email
// @access Private

router.post('/activation', user_activation)



// @route   POST localhost:5000/api/users/login
// @desc    LoggedIn user // return jwt
// @access  Public
router.post('/login', user_loggedIn)


// @route   Get localhost:5000/api/users/login/current
// @desc    Current LoggedIn user // return userinfo
// @access  Private
router.get('/current', checkauth, user_current)


// @route   Get localhost:5000/api/users/google
// @desc    LoggedIn user from google // return jwt
// @access  Public
router.get('/google', checkgoogle, user_login_google) // Swagger_UI에서 get 메소드를 지원하지 않아 post로 변경


// @route   Get localhost:5000/api/users/facebook
// @desc    LoggedIn user from facebook // return jwt
// @access  Public
router.get('/facebook', checkfacebook, user_login_facebook)

// @route   PUT user/forgotpassword
// @desc    forgot password / send email
// @access  Public
router.put('/forgotpassword', user_forgot_password)

// @route   PUT user/resetpassword
// @desc    reset password
// @access  Public
router.put('/resetpassword', user_reset_password)



module.exports = router