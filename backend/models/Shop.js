const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    shopkeeperId: {
        type: String, // Could be ObjectId ref 'User'
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    totalStock: {
        type: Number,
        default: 0,
    },
    location: {
        lat: Number,
        lng: Number,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Shop = mongoose.model('Shop', shopSchema);
module.exports = Shop;
