const mongoose = require('mongoose');

const slotSchema = mongoose.Schema({
    shopId: {
        type: String, // Could be ObjectId ref 'Shop'
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
    maxCapacity: {
        type: Number,
        required: true,
    },
    bookedCount: {
        type: Number,
        default: 0,
    },
    stockLimit: {
        rice: Number,
        wheat: Number,
        sugar: Number,
        kerosene: Number,
    },
    availableStock: {
        rice: Number,
        wheat: Number,
        sugar: Number,
        kerosene: Number,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Slot = mongoose.model('Slot', slotSchema);
module.exports = Slot;
