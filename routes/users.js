
const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStrategy = require('passport-jwt/lib/strategy');

const checkauth = passport.authenticate('jwt', { session: false});
const checkgoogle = passport.authenticate('googleToken', { session: false});

const {
    user_register,
    user_activation,
    user_loggedIn,
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
router.get('/google', checkgoogle, (req, res) => {
    const payload = { id: req.user._id }

    const token = jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {expiresIn: '1h'}
    )

    res.json({
        success: true,
        token: "Bearer " + token
    })
})


module.exports = router