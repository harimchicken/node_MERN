const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const ProfileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        handle: {
            type: String,
            required: true,
            max: 40
        },
        company: {
            type: String
        },
        website: {
            type: String
        },
        location: {
            type: String
        },
        status: {
            type: String,
            required: true
        },
        skills: {
            type: [String],
            required: true
        },
        bio: {
            type: String
        },
        githubusername: {
            type: String
        },
        experience: [],
        education: []
    },
    {
        timestamps: true
    }
)




module.exports = model('profile', ProfileSchema)