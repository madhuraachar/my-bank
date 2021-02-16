const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    cardName: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    inCardAmount: {
        type: Number,
        default: 0,
        trim: true
    },
    spentAmount: {
        type: Number,
        default: 0,
        trim: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cardNumber: {
        type: mongoose.Schema.Types.ObjectId
    }
})

const Card = mongoose.model('Cards', cardSchema)

module.exports = Card;