const mongoose = require('mongoose');

const{Schema,model} = mongoose;

// Create Schema
const PostSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        name: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        likes: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'user'
                }
            }
        ],
        comment: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'user'
                },
                text: {
                    type: String,
                    required: true
                },
                name: {
                    type: String
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
)



module.exports  = model('post', PostSchema)