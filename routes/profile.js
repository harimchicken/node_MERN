
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

// @route   POST api/profile 
// @desc    Register / update user profile
// @access  Private

router.post('/', checkauth, (req, res) => {
    const profileFields = {};

    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.user) profileFields.user = req.user.id
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusename) profileFields.githubusename = req.body.githubusename

    // Skills - Split into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }

    profileModel
        .findOne( {user: req.user.id })
        .then(profile => {
            if (profile) {
                // update code
                profileModel
                    .findOneAndUpdate(
                        {user: req.user.id}, // 업데이트 할 대상자
                        { $set: profileFields}, // 업데이트 내용
                        { new: true}  // 옵션
                    )
                    .then(profile => res.json(profile))
                    .catch(err => res.status(408).json(err))





                // return res.status(400).json({
                //     msg: "등록된 프로필이 있습니다. 업데이트 또는 삭제 후 다시 등록해주세요"
                // })
            } else {
                const newProfile = new profileModel(profileFields)
                newProfile
                    .save()
                    // .populate ('user')
                    .then(user => res.json(user))
            }
        })
        .catch(err => res.status(500).json(err))


})

module.exports = router