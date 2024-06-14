const {Schema, model} = require('mongoose');

const postSchema = new Schema({
    title: {type: String, required: true},
    category: {type: String, enum: ['Food', 'Life', 'Tech', 'Game'], message: 'Category must be either Food, Life, Tech, or Game'},
    desc: {type: String, required: true},
    thumbnail: {type: String, required: true},
    creator: {type: Schema.Types.ObjectId, ref: "User"},
}, {timestamps: true});

module.exports = model('Post', postSchema);