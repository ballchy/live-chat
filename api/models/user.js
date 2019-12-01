const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
});

module.exports = mongoose.model('Message', messageSchema);