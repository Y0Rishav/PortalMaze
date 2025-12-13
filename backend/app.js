import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/levels', (await import('./routes/levels.js')).default);

app.use('/api/scores', (await import('./routes/scores.js')).default);

export default app;
