import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshSecretKey';

// register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // checker for user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Username already exists' 
            });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ 
            message: 'User registered successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Server error', error: error.message 
        });
    }
});

// login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // checker for user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ 
                message: 'Invalid credentials' 
            });
        }

        // checker for password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                message: 'Invalid credentials' 
            });
        }

        // Generate tokens
        const accessToken = jwt.sign({ 
            id: user._id, 
            username: user.username 
        }, 
        JWT_SECRET, { expiresIn: '15m' });

        const refreshToken = jwt.sign({ 
            id: user._id, 
            username: user.username 
        }, 
        JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // Send refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ 
            message: 'Login successful',
            username: user.username,
            userId: user._id,
            accessToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Refresh Token
router.post('/refresh', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.json({ accessToken: null, message: 'No refresh token found' });
    }

    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const accessToken = jwt.sign({ id: decoded.id, username: decoded.username }, JWT_SECRET, { expiresIn: '15m' });

        res.json({ accessToken });
    } catch (error) {
        res.clearCookie('refreshToken');
        return res.json({ accessToken: null, message: 'Invalid refresh token' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
});

export default router;
