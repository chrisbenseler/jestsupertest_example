const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

module.exports = mongoose.model("post", postSchema)