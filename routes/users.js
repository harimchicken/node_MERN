
const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStrategy = require('passport-jwt/lib/strategy');
const  sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_KEY)

const userModel = require('../models/user');

const checkauth = passport.authenticate('jwt', { session: false});
const checkgoogle = passport.authenticate('googleToken', { session: false});
const checkfacebook = passport.authenticate('facebookToken', { session: false });
const checknaver = passport.authenticate('naver-login', {session: false});


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


// @route   Get localhost:5000/api/users/facebook
// @desc    LoggedIn user from facebook // return jwt
// @access  Public
router.get('/facebook', checkfacebook, (req, res) => {
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

// @route   PUT user/forgotpassword
// @desc    forgot password / send email
// @access  Public
router.put('/forgotpassword', (req, res) => {
    const {email} = req.body;

    userModel
        .findOne({email})
        .then(user => {
            console.log(user)
            if (!user) {
                res.status(404).json({
                    message: 'user is not register'
                })
            }
            // 유저가 있다면...
            // 메일 보낼 준비
            const payload = {_id: user._id};
            const token = jwt.sign(
                payload,
                process.env.SECRET_KEY,
                {expiresIn: '10m'}
            )

            const emailData = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: "Password Reset Link",
                html: `
                <h1>Please use the following link to reset your password</h1>
                <p>http://localhost:5000/user/password/reset/${token}</p>
                <hr />,
                <p>This email may contain sensetive information</p>
                <p>http://localhost:5000</p>
                `
            }

            return user
                .updateOne({ resetPasswordLink: token })
                .then(() => {

                    sgMail
                        .send(emailData)
                        .then(() => {
                            
                            res.json({
                                message: `Email has been sent to ${email}. Follow the instruction to activate your account`
                            })
                        })
                        .catch(err => {
                            return res.status(404).json({
                                message: err.message
                            })
                        })
                })
                .catch(err => {
                    res.status(408).json({
                        error : 'Database connection error on user password forgot request'
                    })

                })


            // return user
            //     .updateOne({resetPasswordLink: token})
            //     .then(user => {

            //         console.log("*********", user)
            //         sgMail
            //             .send(emailDate)
            //             .then((data) => {

            //                 console.log(data)
            //                 res.status(200).json({
            //                     message: `Email has been sent to ${email}. Follow the instruction to activate your account`
            //                 })
            //             })
            //             .catch(err => {
            //                 return res.status(404).json({
            //                     message: err.message
            //                 })
            //             })
            //     })
            //     .catch(err => {
            //         res.status(408).json({
            //             error: 'Database connection error on user password forgot request'
            //         })
            //     })

        })
        .catch(err => res.status(500).json(err))
})



module.exports = router