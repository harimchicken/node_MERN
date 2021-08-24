
const express = require('express')
const router = express.Router()

const passport = require('passport');
const profile = require('../models/profile');

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
                // // update code
                // profileModel
                //     .findOneAndUpdate(
                //         {user: req.user.id}, // 업데이트 할 대상자
                //         { $set: profileFields}, // 업데이트 내용
                //         { new: true}  // 옵션
                //     )
                //     .then(profile => res.json(profile))
                //     .catch(err => res.status(408).json(err))

                return res.status(400).json({
                    msg: "등록된 프로필이 있습니다. 업데이트 또는 삭제 후 다시 등록해주세요"
                })
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

// @route   Put api/profile 
// @desc    udadate user profile
// @access  Private

router.put('/', checkauth, (req, res) => {
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
        .findOne( {user: req.user.id} )
        .then(profile => {
            if (!profile) {
                res.status(404).json({
                    msg: "please register your profile"
                })
            } else {
                // update code
                profileModel
                    .findOneAndUpdate(
                        {user: req.user.id}, // 업데이트 할 대상자
                        { $set: profileFields}, // 업데이트 내용
                        { new: true}  // 옵션
                    )
                    .then(profile => res.json(profile))
                    .catch(err => res.status(408).json(err))
            }
        })
        .catch(err => res.status(500).json(err))
}) 


// @route   Delete api/profile 
// @desc    delete user profile
// @access  Private

router.delete('/', checkauth, (req, res) => {

    profileModel
        .findOneAndRemove({user: req.user.id})
        .then(result => {
            res.json({
                msg: "Deleted your profile"
            })
        })
        .catch(err => res.status(500).json(err))
})

// @route   POST api/profile/experience 
// @desc    Add experience to profile
// @access  Private

router.post('/experience', checkauth, (req, res) => {
    
    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            console.log("++++++++++", profile)
            if (!profile) {
                return res.status(404).json({
                    message: 'There is no profile for this user'
                })
            } else {
                const newExp = {
                    title: req.body.title,
                    company: req.body.company,
                    location: req.body.location,
                    from: req.body.from,
                    to: req.body.to,
                    current: req.body.current,
                    description: req.body.description
                };

                profile.experience.unshift(newExp)
                profile
                    .save()
                    .then(profile => res.json(profile))
                    .catch(err => res.status(500).json(err))
            }

        })
        .catch(err => res.status(500).json)
})


// @route   POST api/profile/education 
// @desc    Add education to profile
// @access  Private

router.post('/education', checkauth, (req, res) => {

    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            console.log("++++++++++", profile)
            if (!profile) {
                return res.status(404).json({
                    message: "There is no profile for this user"
                })
            } else {
                const newEdu = {
                    school: req.body.school,
                    degree: req.body.degree,
                    fieldofstudy: req.body.fieldofstudy,
                    from: req.body.from,
                    current: req.body.current
                }

                profile.education.unshift(newEdu)
                profile
                    .save()
                    .then(profile => res.json(profile))
                    .catch(err => res.status(500).json(err))
            }
        })
        .catch(err => res.status(500).json(err))
})

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private

router.delete('/experience/:exp_id', checkauth, (req, res) => {

    const expId = req.params.exp_id

    profileModel
        .findOne({ user: req.user.id })
        .then(profile => {
            console.log("+++++++++++++", profile)
            const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(expId)

            // splice out of array
            profile.experience.splice(removeIndex, 1)
            profile.save().then(profile => res.json(profile))
        })
        .catch(err => res.status(500).json(err))
})

module.exports = router