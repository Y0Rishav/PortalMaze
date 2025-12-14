import express from 'express';
import Score from '../models/Score.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

//for getting leaderboard particular level ke leye
router.get('/:levelId/:mode', async (req, res) => {
    const { mode } = req.params;
    if (!['nwb', 'wb'].includes(mode)) {
        return res.status(400).json({ message: 'Invalid mode' });
    }
    try {
        const scores = await Score.find({ levelId: req.params.levelId, mode })
        .sort({ efficiency: 1, time: 1, steps: 1 })
        .limit(10);
        res.json(scores);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


//for posting score
router.post('/', verifyToken, async (req, res) => {
    const { levelId, mode, steps, time, efficiency } = req.body;
    const playerName = req.user.username;

    if (!['nwb', 'wb'].includes(mode)) {
        return res.status(400).json({ message: 'Invalid mode' });
    }

    try {
        // Check for existing score
        const existingScore = await Score.findOne({ levelId, playerName, mode });

        if (existingScore) {
            const isBetter = 
                efficiency < existingScore.efficiency ||
                (efficiency === existingScore.efficiency && time < existingScore.time);

            if (isBetter) {
                existingScore.steps = steps;
                existingScore.time = time;
                existingScore.efficiency = efficiency;
                existingScore.createdAt = Date.now(); // Update timestamp
                const updatedScore = await existingScore.save();
                return res.status(200).json(updatedScore);
            } else {
                // Keep existing score
                return res.status(200).json(existingScore);
            }
        }

        // Create new score
        const score = new Score({
            levelId,
            playerName,
            mode,
            steps,
            time,
            efficiency
        });

        const newScore = await score.save();
        res.status(201).json(newScore);
    }
    catch (error) {
        res.status(400).json({ message: 'Bad Request', error: error.message });
    }
});

export default router;