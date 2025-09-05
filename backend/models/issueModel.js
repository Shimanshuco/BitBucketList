const mongoose = require('mongoose');
const { Schema } = mongoose;

const IssueSchema = new Schema({
    title: {
        type: String,   
        required: true,
    },
    description : {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'in progress', 'closed'],
        default: 'open' 
    },
    repository : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Repository',
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Issue = mongoose.model('Issue', IssueSchema);
module.exports = Issue;