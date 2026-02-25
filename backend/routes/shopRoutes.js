const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');

// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
router.get('/', async (req, res) => {
    try {
        const shops = await Shop.find({});
        res.json(shops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get shop by shopkeeper user ID
// @route   GET /api/shops/by-shopkeeper/:userId
// @access  Public
router.get('/by-shopkeeper/:userId', async (req, res) => {
    try {
        const shop = await Shop.findOne({ shopkeeperId: req.params.userId });
        if (shop) {
            res.json(shop);
        } else {
            res.status(404).json({ message: 'Shop not found for this user' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get shop by ID
// @route   GET /api/shops/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        if (shop) {
            res.json(shop);
        } else {
            res.status(404).json({ message: 'Shop not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a shop
// @route   POST /api/shops
// @access  Private/Shopkeeper
router.post('/', async (req, res) => {
    const { name, address, image, shopkeeperId, location } = req.body;

    try {
        const shop = new Shop({
            name,
            address,
            image,
            shopkeeperId,
            location,
            status: 'pending', // Default status
        });

        const createdShop = await shop.save();
        res.status(201).json(createdShop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update shop
// @route   PUT /api/shops/:id
// @access  Private/Admin/Shopkeeper
router.put('/:id', async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);

        if (shop) {
            shop.name = req.body.name || shop.name;
            shop.address = req.body.address || shop.address;
            shop.image = req.body.image || shop.image;
            shop.status = req.body.status || shop.status;
            shop.totalStock = req.body.totalStock || shop.totalStock;

            const updatedShop = await shop.save();
            res.json(updatedShop);
        } else {
            res.status(404).json({ message: 'Shop not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
