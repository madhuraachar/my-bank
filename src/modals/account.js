const mongoose = require('mongoose');

const Account = mongoose.model('Accounts', {
    // accountNo: {
    //     type: String,
    //     trim: true,
    //     required: true,
    //     minlength: 16
    // },
    amount: {
        type: Number,
        trim: true,
        required: true,
        default: 0
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
})

module.exports = Account;