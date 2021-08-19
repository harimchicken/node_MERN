
const express = require('express')
const router = express.Router()

const passport = require('passport')

const checkauth = passport.authenticate('jwt', { session: false});

const {
    user_register,
    user_loggedIn
} = require('../controllers/user')

const userModel = require('../models/user')

// @route   POST localhost:5000/api/users/register
// @desc    Register user
// @access  Public

router.post('/register', user_register)


// @route   POST localhost:5000/api/users/login
// @desc    LoggedIn user // return jwt
// @access  Public
router.post('/login', user_loggedIn)

// @route   Get localhost:5000/api/users/login/current
// @desc    Current LoggedIn user // return userinfo
// @access  Private
router.get('/current', checkauth, (req, res) => {
    req.user.password = undefined
    res.json(req.user);

})





module.exports = router