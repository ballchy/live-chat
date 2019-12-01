const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

const Message = require('../models/message')

router.get('/', (req, res, next) => {
    Message.find()
        .then(results => {
            res.status(200).json(results);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    const message = new Message({
        _id: new mongoose.Types.ObjectId(),
        text: req.body.text,
        posted_at: new Date()
    })

    message.save()
        .then(result => {
            req.io.sockets.emit('chat', result);

            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
})

router.delete('/:messageId', (req, res, next) => {
    const id = req.params.messageId;
    console.log(id)

    Message.deleteOne({ _id: id })
        .then(result => {
            res.status(200).json({
                id: id
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
})

module.exports = router;