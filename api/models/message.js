const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    text: String,
    posted_at: Date,
});

module.exports = mongoose.model('Message', messageSchema);