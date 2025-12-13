import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', (await import('./routes/auth.js')).default);
app.use('/api/levels', (await import('./routes/levels.js')).default);

app.use('/api/scores', (await import('./routes/scores.js')).default);

export default app;
