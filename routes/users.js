
const express = require('express')
const router = express.Router()

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



module.exports = router