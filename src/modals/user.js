const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    dob: {
        type: Date,
        default: new Date()
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    mobileNo: {
        type: String,
        minlength: 10,
        maxlength: 10
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    },
    token: {
        type: String,
        required: true,
        trim: true
    }
});


userSchema.virtual('cards', {
    ref: 'Cards',
    localField: '_id',
    foreignField: 'owner'
})
userSchema.virtual('accounts', {
    ref: 'Accounts',
    localField: '_id',
    foreignField: 'owner'
})
userSchema.virtual('transactions', {
    ref: 'Transactions',
    localField: '_id',
    foreignField: 'owner'
})

//override toJSON method
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.token;
    return userObject;
}

//check credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if(! user) {
        throw new Error('Unale to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(! isMatch) {
        throw new Error('Unable to login')
    }
    return user;
}

//generate token
userSchema.methods.generateToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.token = token;
    await user.save()
    return token
}

userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;