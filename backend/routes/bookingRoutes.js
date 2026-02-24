const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find({});
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get bookings by User ID
// @route   GET /api/bookings/user/:userId
// @access  Private/Beneficiary
router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ beneficiaryId: req.params.userId });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get bookings by Shop ID
// @route   GET /api/bookings/shop/:shopId
// @access  Private/Shopkeeper
router.get('/shop/:shopId', async (req, res) => {
    try {
        const bookings = await Booking.find({ shopId: req.params.shopId });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private/Beneficiary
router.post('/', async (req, res) => {
    try {
        const booking = new Booking(req.body);
        const createdBooking = await booking.save();

        // Update slot booked count and stock
        const slot = await Slot.findById(req.body.slotId);
        if (slot) {
            slot.bookedCount += 1;
            slot.availableStock.rice -= req.body.entitlement.rice;
            slot.availableStock.wheat -= req.body.entitlement.wheat;
            slot.availableStock.sugar -= req.body.entitlement.sugar;
            slot.availableStock.kerosene -= req.body.entitlement.kerosene;
            await slot.save();
        }

        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
