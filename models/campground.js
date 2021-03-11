var mongoose = require('mongoose');

var CampgroundSchema = new mongoose.Schema({
    title: String,
    image: String,
    details: String,
    author: {

        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});
module.exports = mongoose.model('Campgrounds', CampgroundSchema);