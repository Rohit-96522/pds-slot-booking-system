const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Shop = require('../models/Shop');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                shopId: user.shopId || null,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Register a new user (and shop if shopkeeper)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const {
        name, email, password, phone, role,
        cardNumber, familyMembers,
        address, latitude, longitude,
        shopName, shopAddress, shopImage,
        shopLat, shopLng
    } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create the user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            role,
            cardNumber: cardNumber || undefined,
            familyMembers: familyMembers || undefined,
            address: address || undefined,
            location: (latitude && longitude) ? { lat: latitude, lng: longitude } : undefined,
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid user data' });
        }

        // For shopkeeper: create shop and link it to user — all in one request
        if (role === 'shopkeeper') {
            if (!shopName || !shopAddress) {
                // Rollback user creation if shop data missing
                await User.findByIdAndDelete(user._id);
                return res.status(400).json({ message: 'Shop name and address are required for shopkeeper registration' });
            }

            const shop = await Shop.create({
                name: shopName,
                address: shopAddress,
                image: shopImage || 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400',
                shopkeeperId: user._id.toString(),
                status: 'pending',
                totalStock: 0,
                location: (shopLat && shopLng) ? { lat: shopLat, lng: shopLng } : { lat: 28.6139, lng: 77.209 },
            });

            // Link shop to user
            user.shopId = shop._id.toString();
            await user.save();

            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                shopId: user.shopId,
                token: generateToken(user._id),
            });
        }

        // Beneficiary response
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
