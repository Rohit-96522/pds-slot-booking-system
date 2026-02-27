const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'shopkeeper', 'beneficiary'],
        required: true,
    },
    shopId: {
        type: String, // Ideally should be ObjectId ref 'Shop', keeping string for now to match frontend logic or can be ref
        default: null,
    },
    cardNumber: {
        type: String,
    },
    familyMembers: {
        type: Number,
    },
    address: {
        type: String,
    },
    location: {
        lat: Number,
        lng: Number,
    },
}, {
    timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});



const User = mongoose.model('User', userSchema);
module.exports = User;
