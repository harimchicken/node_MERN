const mongoose = require('mongoose')
const Schema = mongoose.Schema

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


module.exports = user = mongoose.model('user', userSchema)