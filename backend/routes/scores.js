import express from 'express';
import Score from '../models/Score.js';

const router = express.Router();

//for getting leaderboard particular level ke leye
router.get('/:levelId', async (req, res) => {
    try {
        const scores = await Score.find({ levelId: req.params.levelId })
        .sort({ efficiency: 1, time: 1, steps: 1 })
        .limit(10);
        res.json(scores);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


//for posting score
router.post('/', async (req, res) => {
    const score = new Score({
        levelId: req.body.levelId,
        playerName: req.body.playerName,
        steps: req.body.steps,
        time: req.body.time,
        efficiency: req.body.efficiency
    });

    try {
        const newScore = await score.save();
        res.status(201).json(newScore);
    }
    catch (error) {
        res.status(400).json({ message: 'Bad Request' });
    }
});

export default router;