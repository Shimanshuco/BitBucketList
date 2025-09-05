const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    repositories: [
        {
            default: [],
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Repository'
        }
    ],
    followedUsers: [
        {
            default: [],
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    starRepos: [
        {
            default: [],
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Repository'
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;