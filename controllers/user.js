const userModel = require("../models/user")
const jwt = require('jsonwebtoken')

exports.user_register = (req, res) => {
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
                            {expiresIn: '30m'}
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