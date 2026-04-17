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

const mongoose = require('mongoose');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private/Beneficiary
router.post('/', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { beneficiaryId, slotId, entitlement } = req.body;

        // 1. ATOMICALLY check and update both Stock and Slot capacity
        // This ensures we claim the food and the time slot atomically
        const updatedSlot = await Slot.findOneAndUpdate(
            { 
                _id: slotId, 
                "availableStock.rice": { $gte: entitlement.rice },
                "availableStock.wheat": { $gte: entitlement.wheat },
                "availableStock.sugar": { $gte: entitlement.sugar },
                "availableStock.kerosene": { $gte: entitlement.kerosene },
                $expr: { $lt: ["$bookedCount", "$maxCapacity"] }
            },
            { 
                $inc: { 
                    bookedCount: 1,
                    "availableStock.rice": -entitlement.rice,
                    "availableStock.wheat": -entitlement.wheat,
                    "availableStock.sugar": -entitlement.sugar,
                    "availableStock.kerosene": -entitlement.kerosene
                } 
            },
            { session, new: true }
        );

        if (!updatedSlot) {
            throw new Error("SLOT FULL OR OUT OF STOCK: This time slot is no longer available or does not have enough rations left.");
        }

        // 2. Create the Booking Record
        const booking = await Booking.create([req.body], { session });

        // Commit all changes atomically
        await session.commitTransaction();
        res.status(201).json(booking[0]);

    } catch (error) {
        // If ANY step fails, the stock and slot are not modified
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
});

// @desc    Verify and Fulfill a booking
// @route   POST /api/bookings/verify
// @access  Private/Shopkeeper
router.post('/verify', async (req, res) => {
    const { qrCode } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Find and Lock the booking for update
        // In the existing schema, we use 'confirmed' (lowercase)
        // Also handling both QR Code and raw Booking ID since VerifyBooking.tsx allows searching by ID
        const booking = await Booking.findOne({ 
            $or: [{ qrCode: qrCode }, { _id: qrCode }],
            status: 'confirmed' 
        }).session(session);

        if (!booking) {
            throw new Error("Invalid QR, already used, or booking not found.");
        }

        // 2. Use the SNAPSHOT taken at booking time (Consistency)
        const amountToDeduct = booking.entitlement;

        // 3. Deduct stock logic
        // Note: In your previous logic, stock was deducted from the 'Slot' globally during booking creation. 
        // If we strictly want to deduct from the Shop's global 'totalStock' now at fulfillment time, we do it here:
        const Shop = require('../models/Shop');
        const shop = await Shop.findById(booking.shopId).session(session);
        
        if (shop && shop.totalStock !== undefined) {
             // Example deduction adapting to your Shop schema 
             // (Assuming totalStock is a single metric. If it needs to be an object, Shop schema would need updating)
             const totalItems = (amountToDeduct.rice || 0) + (amountToDeduct.wheat || 0) + (amountToDeduct.sugar || 0);
             if (shop.totalStock >= totalItems) {
                 shop.totalStock -= totalItems;
                 await shop.save({ session });
             }
        }

        // 4. Update status to completed
        booking.status = 'completed';
        booking.fulfilledAt = new Date();
        await booking.save({ session });

        await session.commitTransaction();
        res.json({ success: true, message: "Ration Distributed Successfully", booking });

    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ success: false, message: error.message });
    } finally {
        session.endSession();
    }
});

module.exports = router;