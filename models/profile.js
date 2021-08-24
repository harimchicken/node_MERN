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
        experience: [
            {
                title: {
                    type: String,
                    required: true
                },
                company: {
                    type: String,
                    required: true
                },
                location: {
                    type: String,
                    required: true
                },
                from: {
                    type: Date,
                    required: true
                },
                to: {
                    type: Date
                },
                current: {
                    type: Boolean,
                    default: false
                },
                description: {
                    type: String
                }
            }
        ],
        education: [
            {
                school: {
                    type: String,
                    required: true
                },
                degree: {
                    type: String,
                    required: true
                },
                fieldofstudy: {
                    type: String,
                    required: true
                },
                from: {
                    type : Date,
                    required: true
                },
                to: {
                    type: Date
                },
                current: {
                    type: Boolean,
                    required: false
                },
                description: {
                    type: String
                }
            }
        ]
    },
    {
        timestamps: true
    }
)




module.exports = model('profile', ProfileSchema)