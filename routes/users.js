
const express = require('express')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const normalize = require('normalize-url')
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

                // 어떤것을 기준으로 만들거냐
                const avatar =  normalize(
                    gravatar.url(email, {
                        s: '200',   // size
                        r: 'pg',    // Rating
                        d: 'mm'     // Default
                    }),
                    { forceHttps: true}
                )

                // 패스워드 암호화
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) throw err;
                    // 디비에 저장
                    const newUser = new userModel({
                        name, email, password: hash, avatar
                    })
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => res.status(408).json(err))
                })
            }
        })
        .catch(err => res.status(500).json(err))



    // userModel
    //     .findOne({email: req.body.email})
    //     .then(user => {
    //         if (user) {
    //             return res.status(400).json({
    //                 err: "기존에 등록된 이메일이 있습니다, 다른 이메일로 가입 바랍니다."
    //             })
    //         } else {
    //             bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    //                 if(err) {
    //                     return res.status(404).json({
    //                         error: err
    //                     })
    //                 } else {
    //                     const newUser = new userModel({
    //                         user: req.body.user,
    //                         email: req.body.email,
    //                         password: hashedPassword
    //                     })
            
    //                     newUser
    //                         .save()
    //                         .then(user => {
    //                             res.json({
    //                                 msg: "successful signup",
    //                                 userInfo: user
    //                             })
    //                         })
    //                         .catch(err => {
    //                             res.status(500).json({
    //                                 err: err.message
    //                             })
    //                         })
    //                 }
    //             })
    //         }
    //     })
})


module.exports = router