const userModel = require("../models/user");
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_KEY);

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

exports.user_current = (req, res) => {
    req.user.password = undefined
    res.json(req.user);

}