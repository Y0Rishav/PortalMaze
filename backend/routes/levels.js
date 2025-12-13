import express from 'express';
import Level from '../models/Level.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const levels = await Level.find().sort({ createdAt: -1 });
        res.json(levels);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const level = new Level({
        name: req.body.name,
        description: req.body.description,
        creator: req.user.username,
        maze: req.body.maze,
        k: req.body.k,
        par: req.body.par
    });

    try {
        const newLevel = await level.save();
        res.status(201).json(newLevel);
    }
    catch (error) {
        res.status(400).json({ message: 'Bad Request' });
    }
});

export default router;