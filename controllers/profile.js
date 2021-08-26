const profileModel = require('../models/profile')

exports.profile_get_detail = (req, res) => {
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
}

exports.profile_post_profile = (req, res) => {
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


}

exports.profile_put_update = (req, res) => {
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
}

exports.profile_delete_detail = (req, res) => {

    profileModel
        .findOneAndRemove({user: req.user.id})
        .then(result => {
            res.json({
                msg: "Deleted your profile"
            })
        })
        .catch(err => res.status(500).json(err))
}

exports.profile_post_experience = (req, res) => {
    
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
}

exports.profile_post_education = (req, res) => {

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
}

exports.profile_delete_experience = (req, res) => {

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
}

exports.profile_delete_education = (req, res) => {

    const eduId = req.params.edu_id

    profileModel
        .findOne({ user: req.user.id })
        .then(profile => {
            console.log("+++++++++++++", profile)
            const removeIndex2 = profile.education
            .map(item2 => item2.id)
            .indexOf(eduId)

            // splice out of array
            profile.education.splice(removeIndex2, 1)
            profile.save().then(profile => res.json(profile))
        })
        .catch(err => res.status(500).json(err))
}