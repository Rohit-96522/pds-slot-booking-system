const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');

// @desc    Get all slots
// @route   GET /api/slots
// @access  Public
router.get('/', async (req, res) => {
    try {
        const slots = await Slot.find({});
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get slots by shop ID
// @route   GET /api/slots/shop/:shopId
// @access  Public
router.get('/shop/:shopId', async (req, res) => {
    try {
        const slots = await Slot.find({ shopId: req.params.shopId });
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a slot
// @route   POST /api/slots
// @access  Private/Shopkeeper
router.post('/', async (req, res) => {
    try {
        const slot = new Slot(req.body);
        const createdSlot = await slot.save();
        res.status(201).json(createdSlot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a slot
// @route   PUT /api/slots/:id
// @access  Private/Shopkeeper
router.put('/:id', async (req, res) => {
    try {
        const slot = await Slot.findById(req.params.id);
        if (slot) {
            Object.assign(slot, req.body);
            const updatedSlot = await slot.save();
            res.json(updatedSlot);
        } else {
            res.status(404).json({ message: 'Slot not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
