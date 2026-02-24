const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    beneficiaryId: {
        type: String, // Could be ObjectId ref 'User'
        required: true,
    },
    beneficiaryName: {
        type: String,
        required: true,
    },
    shopId: {
        type: String, // Could be ObjectId ref 'Shop'
        required: true,
    },
    shopName: {
        type: String,
        required: true,
    },
    slotId: {
        type: String, // Could be ObjectId ref 'Slot'
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true,
    },
    stockLimit: {
        rice: Number,
        wheat: Number,
        sugar: Number,
        kerosene: Number,
    },
    entitlement: {
        rice: Number,
        wheat: Number,
        sugar: Number,
        kerosene: Number,
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed'],
        default: 'confirmed',
    },
    qrCode: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
