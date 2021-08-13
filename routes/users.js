
const express = require('express')
const router = express.Router()

const userModel = require('../models/user')

// @route   POST localhost:5000/api/users/register
// @desc    Register user
// @access  Public

router.post('/register', (req, res) => {
    // 유저 이메일 유무 확인 -> 패스워드 암호화 -> 디비에 저장
    
    const {name, email, password} = req.body;

    userModel
        .findOne({email})
        .then(user => {
            if (user) {
                return res.status(400).json({
                    message: 'Email already exists'
                })
            } else {

                const newUser = new userModel({
                    name, email, password
                })

                newUser
                    .save()
                    .then(user => {
                        user.password = undefined;
                        res.json({
                            message: "successful signup",
                            userInfo: user
                        })
                    })
                    .catch(err => {
                        res.status(500).json(err)
                    })

            }
        })
        .catch(err => res.status(500).json(err))

})


module.exports = router