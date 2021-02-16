const mongoose = require('mongoose');

const Transaction = mongoose.model('Transactions', {
    name: {
        type: String,
        trim: true,
        required: true
    },
    accountNo: {
        type: String,
        trim: true,
        required: true,
        minlength: 16
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    amount: {
        type: Number,
        trim: true,
        required: true,
        default: 0
    },
    bankName: {
        type: String,
        required: true,
        trim: true
    },
    transactionType: {
        type: String,
        required: true
    },
    type: {
        type: String, //saved account or transfer money
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        default: new Date()
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = Transaction;