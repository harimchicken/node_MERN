const userModel = require("../models/user");
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_KEY);
const lodash = require('lodash');

exports.user_register = (req, res) => {
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
                            message: `Email has been sent to ${email}`,
                            token
                        })
                    })
                    .catch(err => res.status(408).json(err))
            }
        })
        .catch(err => res.status(500).json(err))
}

exports.user_activation = (req, res) => {
    const { token } = req.body
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
            if (err) {
                return res.status(401).json({
                    errors: 'Expired link. Signup agian'
                })
            } else {
                const {name, email, password} = jwt.decode(token)
                const newUser = new userModel({
                    name, email, password
                })

                newUser.save()
                    .then(user => {
                        user.password = undefined;
                        res.json({
                            message: "successful signup",
                            userInfo: user
                        })
                    })
                    .catch(err => res.status(408).json(err))
            }
        })
    }
}

exports.user_loggedIn = (req, res) => {
    // 이메일 유무 체크 -> 패스워드 매칭 체크 -> return jwt
    const {email, password} = req.body;

    userModel
        .findOne ({email})
        .then(user => {
            if (!user) {
                return res.status(400).json({
                    message: "Invaild credentials"
                })
            } else {
                user.comparePassword(password, (err, isMatch) => {
                    if (err || !isMatch) {
                        return res.status(400).json({
                            message: 'Invalid credentials'
                        })
                    } else {
                        // jwt 생성
                        const token = jwt.sign(
                            { id: user._id},
                            process.env.SECRET_KEY,
                            {expiresIn: '1h'}
                        )

                        res.json({
                            message: 'successful loggedin',
                            token
                        })
                    }
                })
                // bcrypt.compare(password, user.password, (err, isMatch) => {
                //     if (err || !isMatch) {
                //         return res.status(404).json({
                //             message: "password do not matched"
                //         })
                //     } else {
                //         // return jwt
                //     }
                // })
            }
        })
        .catch(err => res.status(500).json(err))

}

exports.user_login_google = (req, res) => {
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
}

exports.user_login_facebook = (req, res) => {
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
}

exports.user_forgot_password = (req, res) => {
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
}

exports.user_reset_password = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    if(resetPasswordLink) {

        jwt.verify(resetPasswordLink, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(400).json({
                    error: 'Expired Link. Try again'
                })

            } else {
                userModel
                    .findOne({resetPasswordLink})
                    .then(user => {
                        const updateFields = { password: newPassword, resetPasswordLink: ''}

                        user = lodash.extend(user, updateFields)

                        user
                            .save()
                            .then(user => {
                                res.json({
                                    message: 'Great! Now you can login with new password',
                                    userInfo: user
                                })
                            })
                            .catch(err => res.status(408).json({
                                error: 'Error resetting user passowrd'
                            }))
                    })
                    .catch(err => res.status(500).json(err))
            }
        })
    }
}

exports.user_current = (req, res) => {
    req.user.password = undefined
    res.json(req.user);

}