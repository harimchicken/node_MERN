
const express = require('express')
const router = express.Router()

const passport = require('passport')

const checkauth = passport.authenticate('jwt', { session: false});

const profileModel = require('../models/profile')


// @route   GET api/profile 
// @desc    GET current users profile
// @access  Private
// api 다음에 profile은 url 접근시 localhost:7000/api/profile

router.get('/', checkauth, (req, res) => {
    profileModel
        .findOne( {user: req.user.id })
        .then(profile => {
            if (!profile) {
                return res.status(404).json({
                    message: 'There is no profile for this user'
                })
            }
            res.json(profile)
        })
        .catch(err => res.status(500).json(err))
})


module.exports = router