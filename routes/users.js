
const express = require('express')
const router = express.Router()

const passport = require('passport')

const checkauth = passport.authenticate('jwt', { session: false});

const jwt = require('jsonwebtoken');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_KEY);

const userModel = require('../models/user');

const {
    user_register,
    user_loggedIn
} = require('../controllers/user')


// @route   POST localhost:5000/api/users/register
// @desc    가입 정보를 암호화(token)해서 메일로 보냄
// @access  Public
router.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    
    userModel
        .findOne({email})
        .then(user => {
            if (user) {
                return res.status(400).json({
                    message: "email exists"
                })
            } else {
                const payload = {name, email, password}

                const token = jwt.sign(
                    payload,
                    process.env.SECRET_KEY,
                    {expiresIn: '10m'}
                )

                const emailData = {
                    from: process.env.EMAIL_FROM,
                    to: email,
                    subject: 'Account activation link',
                    html: `
                        <h1>Please use the following to activate your account</h1>                    
                        <p>http://localhost:3000/user/activate/${token}</p>
                        <hr />
                        <p>This email may contain sensetive information</p>
                        <p>http://localhost:3000</p> 
                     `
                }

                sgMail
                    .send(emailData)
                    .then(() => {
                        res.json({
                            message: `Email has been sent to ${email}`
                        })
                    })
                    .catch(err => res.status(408).json(err))
            }
        })
        .catch(err => res.status(500).json(err))
})

// router.post('/register', user_register)


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