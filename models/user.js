const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const avatar = require('gravatar')
const normalize = require('normalize-url')
const gravatar = require('gravatar/lib/gravatar')

// 회원가입시 필요했던 내용
const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

// 저장하기 전에 아바타하고 패스워드를 암호화 해서 저장 기능을 만듬
userSchema.pre('save', async function (next) {
    try {
        console.log('entered')
        // 아바타 생성
        const avatar = await normalize(
            gravatar.url(this.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            }),
            { forceHttps: true }
        )
        
        this.avatar = avatar;
        // 패스워드 암호화
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)

        this.password = hashedPassword

        console.log('exited')
        next()


    } catch (error) {
        next(error)
    }
}) 

// 패스워드 매칭 함수
userSchema.methods.comparePassword = function (candidatePasswrod, cb) {
    bcrypt.compare(candidatePasswrod, this.password, function (err, isMatch) {
        if (err) throw cb(err);
        cb(null, isMatch)
    })
}


module.exports = user = mongoose.model('user', userSchema)