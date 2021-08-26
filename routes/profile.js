// 1
const express = require('express')
const router = express.Router()

const passport = require('passport');

const checkauth = passport.authenticate('jwt', { session: false});


const {
    profile_get_detail,
    profile_post_profile,
    profile_put_update,
    profile_delete_detail,
    profile_post_experience,
    profile_post_education,
    profile_delete_experience,
    profile_delete_education
} = require('../controllers/profile')


// 2


// @route   GET api/profile 
// @desc    Get current users profile
// @access  Private
// api 다음에 profile은 url 접근시 localhost:7000/api/profile
router.get('/', checkauth, profile_get_detail)


// @route   POST api/profile 
// @desc    Register / Update user profile
// @access  Private
router.post('/', checkauth, profile_post_profile)


// @route   PUT api/profile 
// @desc    Udadate user profile
// @access  Private
router.put('/', checkauth, profile_put_update) 


// @route   DELETE api/profile 
// @desc    Delete user profile
// @access  Private
router.delete('/', checkauth, profile_delete_detail)


// @route   POST api/profile/experience 
// @desc    Add experience to profile
// @access  Private
router.post('/experience', checkauth, profile_post_experience)


// @route   POST api/profile/education 
// @desc    Add education to profile
// @access  Private
router.post('/education', checkauth, profile_post_education)


// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', checkauth, profile_delete_experience)


// @route   DELETE api/profile/education/:eud_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', checkauth, profile_delete_education)


// 3
module.exports = router